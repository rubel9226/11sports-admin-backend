const createError = require("http-errors");
const bcrypt = require('bcryptjs');

const { successResponse } = require("./response.controllers");
const Admin = require("../models/admin.model");
const { default: mongoose } = require("mongoose");


const handleAddAdmin =async (req, res, next) => {
    try {
        const data = {};
        const { userName, fullName, phone, password, } = req.body;

        const isExist = await Admin.findOne({userName: userName});
        if(isExist){
            throw createError(404, 'Admin is already exist!')
        }
        
        const currentAdmin = req.user;    
        const roleHierarchy = {
            s_mother_panel: "mother_panel",
            mother_panel: "white_level",
            white_level: "super_admin",
            super_admin: "admin",
            admin: "senior_super",
            senior_super: "super",
            super: "agent",
            agent: "user"
        };

        if(!currentAdmin){
            throw createError(404, 'Please Login first.');
        }else{
            data.adminId = currentAdmin._id;
            data.role = roleHierarchy[currentAdmin.role];
        };

        
        const newRole = roleHierarchy[currentAdmin.role];
        console.log(newRole, 'new role');

        const isValid = ['userName', 'fullName', 'email', 'phone', 'password'];
        isValid.map((value) => {
            if(req.body[value]){
                data[value] = req.body[value]
            }
        }); 

        const newUser =await Admin.create(data);
        console.log(newUser);

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is Create successfully.',
            payload: newUser
        });
    } catch (error) {
        next(error);
    }

};



const handleDepositWithdraw = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user._id;
        let { amount, type, password} = req.body;
        amount = Number(amount);

        // validation
        if (!amount || amount <= 0) {
            throw createError(400, 'Amount is reuired');
        }

        if (!type) {
            throw createError(400, 'Transaction type is required');
        }

        if (!password) {
            throw createError(400, 'Password is required');
        }
        
        if (adminId.toString() === id.toString()) {
            throw createError(400, 'You cannot transfer to yourself');
        }

        // logged in admin
        const admin = await Admin.findById({_id: adminId});
        if (!admin) {
            throw createError(404, 'Admin not found');
        }

        // password check
        const isPassword = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPassword) {
            throw createError(
                400,
                // 'Error in withdraw amount, please try again'
                'Password is invalid!'
            );
        }

        // target admin
        const targetAdmin = await Admin.findById(id);

        if (!targetAdmin) {
            throw createError(404, 'Target admin not found');
        }


        // DEPOSIT 
        if (type === 'deposit') {  
            if (admin.balance < amount) {
                throw createError(400, 'Insufficient Coin!');
            }

            const newAdmin = await Admin.findByIdAndUpdate(
                {_id: adminId},
                {
                    $inc: {
                        balance: -amount
                    }
                },
                {returnDocument: 'after'}
            ).select(' userName balance isBanned role');
            
            const updatedTargetAdmin = await Admin.findByIdAndUpdate(
                {_id: id},
                {
                    $inc: {
                        balance: amount
                    }
                },
                { returnDocument: 'after' }
            ).select(' userName balance exposure isBanned role');

            return successResponse(res, {
                statusCode: 200,
                message: 'Deposit successful',
                payload: {
                    updatedTargetAdmin,
                    newAdmin
                }
            });
        }

        

        // WITHDRAW
        if (type === 'withdraw') {
            
            if (targetAdmin.balance < amount) {
                throw createError(400, 'Insufficient Coin!');
            }
            
            const newAdmin = await Admin.findByIdAndUpdate(
                {_id: adminId},
                {
                    $inc: {
                        balance: amount
                    }
                },
                {returnDocument: 'after'}
            ).select(' userName balance exposure isBanned role');

            
            const updatedTargetAdmin = await Admin.findByIdAndUpdate(
                {_id: id},
                {
                    $inc: {
                        balance: -amount
                    }
                },
                { returnDocument: 'after' }
            ).select(' userName balance exposure isBanned role');

            return successResponse(res, {
                statusCode: 200,
                message: 'Withdraw successful',
                payload: {updatedTargetAdmin, newAdmin}
            });
        }

        throw createError(400, 'Invalid transaction type');

    } catch (error) {
        next(error);
    }
};


// get admins
const handleGetAdmins =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const search = req?.query?.search || '';
        const status = req?.query?.status || '';

        console.log({search, status})

        if(!adminId){
            throw createError(404, 'Please login first.');
        } 


        const roleHierarchy = {
            s_mother_panel: "mother_panel",
            mother_panel: "white_level",
            white_level: "super_admin",
            super_admin: "admin",
            admin: "senior_super",
            senior_super: "super",
            super: "agent",
            agent: "user"
        };

        const nextRole = roleHierarchy[req.user.role]; 

        // by id
        const [admin] = await Admin.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            }, 
            {
                $graphLookup: {
                    from: "users",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "adminId",
                    as: "downline",
                },
            },
            {
                $addFields: {
                    availableBalance: {
                        $add: [
                            "$balance",
                            { $sum: "$downline.balance" }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    totalBalance: {
                        $add: [ 
                            { $sum: "$downline.balance" }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    totalAvailableBalance: {
                        $add: [ 
                            { $sum: "$downline.balance" }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    totalPlayerBalance: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$downline", 
                                        as: "item",
                                        cond: {
                                            $eq: ["$$item.role", nextRole]
                                        }
                                    }
                                },
                                as: 'child',
                                in: "$$child.balance"
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    totalExposure: {
                        $add: [
                            "$exposure",
                            { $sum: "$downline.exposure" }
                        ]
                    }
                }
            },

            // children
            {
                $addFields: {
                    children: {
                        $sortArray: {
                            input: {

                                $map: {
                                    // 
                                    input: {
                                        $filter: {
                                            input: "$downline",
                                            as: "item",
                                            cond: {
                                                $and: [
                                                    {
                                                        $eq: ["$$item.role", nextRole]
                                                    },

                                                    search
                                                        ? {
                                                            $regexMatch: {
                                                                input: "$$item.userName",
                                                                regex: search,
                                                                options: "i"
                                                            }
                                                        }
                                                        : true, 
                                                    status
                                                        ? {
                                                            $eq: [
                                                                "$$item.status",
                                                                status.toLowerCase()
                                                            ]
                                                        }
                                                        : true
                                                ]
                                            }
                                        }
                                    },
        
                                    // 
                                    as: "child",
        
                                    in: {
                                        _id: "$$child._id",
                                        userName: "$$child.userName",
                                        role: "$$child.role",
                                        balance: "$$child.balance",
                                        status: "$$child.status",
                                        isCasino: "$$child.isCasino",
                                        createdAt: "$$child.createdAt",
                                        credit_ref: 0, 

        
                                        totalBalance: {
                                            $add: [
                                                "$$child.balance",
        
                                                {
                                                    $sum: {
                                                        $map: {
                                                            input: {
                                                                $filter: {
                                                                    input: "$downline",
                                                                    as: "sub",
                                                                    cond: {
                                                                        $eq: [
                                                                            "$$sub.adminId",
                                                                            "$$child._id"
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            as: "subItem",
                                                            in: "$$subItem.balance"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
                                        
                                        
                                        totalAvailableBalance: {
                                            $add: [
                                                "$$child.balance",
        
                                                {
                                                    $sum: {
                                                        $map: {
                                                            input: {
                                                                $filter: {
                                                                    input: "$downline",
                                                                    as: "sub",
                                                                    cond: {
                                                                        $eq: [
                                                                            "$$sub.adminId",
                                                                            "$$child._id"
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            as: "subItem",
                                                            in: "$$subItem.balance"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
        
                                        
                                        totalExposure: {
                                            $add: [
                                                "$$child.exposure",
        
                                                {
                                                    $sum: {
                                                        $map: {
                                                            input: {
                                                                $filter: {
                                                                    input: "$downline",
                                                                    as: "sub",
                                                                    cond: {
                                                                        $eq: [
                                                                            "$$sub.adminId",
                                                                            "$$child._id"
                                                                        ]
                                                                    }
                                                                }
                                                            },
                                                            as: "subItem",
                                                            in: "$$subItem.exposure"
                                                        }
                                                    }
                                                }
                                            ]
                                        },
        
                                        playerBalance: { 
                                            $sum: {
                                                $map: {
                                                    input: {
                                                        $filter: {
                                                            input: "$downline",
                                                            as: "sub",
                                                            cond: {
                                                                $eq: [
                                                                    "$$sub.adminId",
                                                                    "$$child._id"
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    as: "subItem",
                                                    in: "$$subItem.balance"
                                                }
                                            }
                                        },
        
                                        ref_P_L: {
                                            $subtract: [
                                                {
                                                    $add: [
                                                        "$$child.balance",
                                                        {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$downline",
                                                                            as: "sub",
                                                                            cond: {
                                                                                $eq: ["$$sub.adminId", "$$child._id"]
                                                                            }
                                                                        }
                                                                    },
                                                                    as: "subItem",
                                                                    in: "$$subItem.balance"
                                                                }
                                                            }
                                                        }
                                                    ]
                                                },
                                                {
                                                    $add: [
                                                        "$$child.exposure",
                                                        {
                                                            $sum: {
                                                                $map: {
                                                                    input: {
                                                                        $filter: {
                                                                            input: "$downline",
                                                                            as: "sub",
                                                                            cond: {
                                                                                $eq: ["$$sub.adminId", "$$child._id"]
                                                                            }
                                                                        }
                                                                    },
                                                                    as: "subItem",
                                                                    in: "$$subItem.exposure"
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }, 
                                    }
                                }
                            },
                            sortBy: { createdAt: 1}
                        }

                    }
                }
            },
            {
                $project: {
                    downline: 0
                }
            }
        ]);

        console.log(admin, 'admin, users')

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is return successfully.',
            // payload: users
            payload: admin
        });
    } catch (error) {
        next(error);   
    }
};


// get all balance
const handleGetBalance =async (req, res, next) => {
    try {
        const adminId = req.user._id;

        if(!adminId){
            throw createError(404, 'Please login first.');
        } 
        
        const users =await Admin.find({adminId})

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is Create successfully.',
            payload: users
            // payload: newUser
        });
    } catch (error) {
        next(error);   
    }
};


const handleBanUnbanCasino =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const {id} = req.params;

        
        const user =await Admin.findOne({_id: id});
        if(!user){
            throw createError('user not found');
        };
        
        
        if(adminId !== user?.adminId.toString()){
            throw createError(404, 'parent not match.');
        } 


        const newUser = await Admin.findOneAndUpdate(
            {_id: id},
            {
                isCasino: !user.isCasino
            },
            {returnDocument: 'after'}
        );
        console.log({
            oldStatus: user.isCasino,
            newStatus: newUser.isCasino
        })

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is Create successfully.',
            payload: newUser 
        });
    } catch (error) {
        next(error);   
    }
}


const handleUpdatePassword =async (req, res, next) => {
    try {
        const {id} = req.params;
        const {password, confirm, yourPassword} = req.body;
        if(password !== confirm){
            throw createError(400, 'Password should be same as new password')
        }

        const isPassword = await bcrypt.compare(
            password,
            admin.password
        );


        const newUser = await Admin.findOneAndUpdate(
            {_id: id},
            {
                isCasino: !user.isCasino
            },
            {returnDocument: 'after'}
        );
        console.log({
            oldStatus: user.isCasino,
            newStatus: newUser.isCasino
        })

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is Create successfully.',
            payload: newUser 
        });
    } catch (error) {
        next(error);   
    }
}



module.exports = {
    handleAddAdmin,
    handleDepositWithdraw,
    handleGetAdmins, 
    handleGetBalance,
    handleBanUnbanCasino, 
    handleUpdatePassword
}