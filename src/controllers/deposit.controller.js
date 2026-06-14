const cloudinary = require("../config/cloudinary");
const Admin = require("../models/admin.model");
const Deposit = require("../models/deposit.model");
const { successResponse } = require("./response.controllers")




const handleCreateDeposit =async (req, res, next) => {
    try {
        const id = req.user._id; 

        const user =await Admin.findOne({_id: id});
        const admin = await Admin.findOne({_id: user?.adminId});
        const data = {
            paymentType: 'deposit'
        }
        const allowedFields = ['accountName', 'txnId', 'accountNumber', 'IFSC_Code', 'holderName', "accountType", "amount", ]
        for(const key in req.body){
            if( allowedFields.includes(key) ){
                data[key] = req.body[key];
            }else if(key === 'email'){
                throw createError(400, 'Email can not be updated');
            }
        }
        
        const image = req.file.path;
        if(user){
            data.userId = user?._id; 
        }
        if(admin){
            data.adminId = admin?._id;
            data.userName = user.userName;
            data.agentName = admin?.userName;
        }
        
        let newImage = '';
        if(image){
            const response = await cloudinary.uploader.upload(image, {
                folder: 'Batting/deposit'
            }); 
            newImage = response.secure_url;
        }
        if(newImage){
            data.image = newImage;
        }
        
        const depositData =await Deposit.create(data);

        return successResponse(res, {
            statusCode: 200, 
            message: 'deposit successfully',
            payload: depositData,
        }) 
    } catch (error) { 
        next(error)
    }
};


const handleConfirmDeposit =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const {id} = req.params;

        const admin = await Admin.findOne({_id: adminId});

        const depositData = await Deposit.findOne({_id: id});
        if(depositData.status !== 'active'){
            throw createError(400, 'Invalid Deposit!')
        }
        
        const updatedDepositData = await Deposit.findOneAndUpdate(
            {_id: id},
            {
                status: 'complete'
            },
            {returnDocument: 'after'}
        );
        if(!depositData || depositData.amount > admin.balance) {
            throw createError('Insufficient Amount');
        }

        const user = await Admin.findOne({_id: depositData.userId});
        

        const updatedAdmin = await Admin.findOneAndUpdate(
            {_id: adminId},
            {
                $inc: {
                    balance: -depositData.amount
                }
            },
            {returnDocument: 'after'}
        );
        if(!updatedAdmin) {
            throw createError('Deposit Field!');
        }
        const updatedUser = await Admin.findOneAndUpdate(
            {_id: depositData.userId},
            {
                $inc: {
                    balance: depositData.amount
                }
            },
            {returnDocument: 'after'}
        );
        if(!updatedUser) {
            throw createError('Deposit Field!');
        }

        console.log(depositData);


        return successResponse(res, {
            statusCode: 200, 
            message: 'deposit successfully',
            // payload: depositData,
        }) 
    } catch (error) { 
        next(error)
    }
};


const handleRejectDeposit =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const {id} = req.params;

        const admin = await Admin.findOne({_id: adminId});

        const depositData = await Deposit.findOne({_id: id});
        if(depositData.status !== 'active'){
            throw createError(400, 'Invalid Deposit!')
        }
        
        const updatedDepositData = await Deposit.findOneAndUpdate(
            {_id: id},
            {
                status: 'reject'
            },
            {returnDocument: 'after'}
        );

        return successResponse(res, {
            statusCode: 200, 
            message: 'deposit successfully',
            payload: updatedDepositData,
        }) 
    } catch (error) { 
        next(error)
    }
};



const handleGetDeposit =async (req, res, next) => {
    try {
        const id = req.user._id; 
        console.log(id);

        const depositData =await Deposit.find({
            adminId: id,
            paymentType: {$eq: 'deposit'},
            status: {$eq: 'active'},
        });
        console.log(depositData);


        return successResponse(res, {
            statusCode: 200, 
            message: 'deposit return successfully',
            payload: depositData,
        }) 
    } catch (error) { 
        console.log(error);
        next(error);
    }
};




const handleCreateWithdraw =async (req, res, next) => {
    try {
        const id = req.user._id; 

        const user =await Admin.findOne({_id: id});
        const admin = await Admin.findOne({_id: user?.adminId});
        const data = {
            paymentType: 'withdraw'
        }
        const allowedFields = ['accountName', 'txnId', 'accountNumber', 'IFSC_Code', 'holderName', "accountType", "amount", ]
        for(const key in req.body){
            if( allowedFields.includes(key) ){
                data[key] = req.body[key];
            }else if(key === 'email'){
                throw createError(400, 'Email can not be updated');
            }
        }
        
 
        if(user){
            data.userId = user?._id; 
        }
        if(admin){
            data.adminId = admin?._id;
            data.userName = user.userName;
            data.agentName = admin?.userName;
        }
        
        
        const withdrawData =await Deposit.create(data);

        return successResponse(res, {
            statusCode: 200, 
            message: 'withdraw successfully.',
            payload: withdrawData,
        }) 
    } catch (error) { 
        next(error)
    }
};




const handleConfirmWithdraw =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const {id} = req.params;

        const admin = await Admin.findOne({_id: adminId});

        const depositData = await Deposit.findOne({_id: id});
        if(depositData.status !== 'active'){
            throw createError(400, 'Invalid withdraw!')
        }
        
        const updatedDepositData = await Deposit.findOneAndUpdate(
            {_id: id},
            {
                status: 'complete'
            },
            {returnDocument: 'after'}
        ); 
        
        
        if(!updatedDepositData) {
            throw createError('withdraw Field!');
        }

        return successResponse(res, {
            statusCode: 200, 
            message: 'Request Withdraw Successful',
            // payload: depositData,
        }) 
    } catch (error) { 
        next(error)
    }
};


const handleRejectWithdraw =async (req, res, next) => {
    try {
        const adminId = req.user._id;
        const {id} = req.params;
        
        const withdrawData = await Deposit.findOne({_id: id});
        if(withdrawData.status !== 'active'){
            throw createError(400, 'Invalid withdraw!')
        }


        
        const updatedWithdrawData = await Deposit.findOneAndUpdate(
            {_id: id},
            {
                status: 'reject'
            },
            {returnDocument: 'after'}
        );

        const updatedUser = await Admin.findOneAndUpdate(
            {_id: withdrawData.userId},
            {
                $inc: {
                    balance: withdrawData.amount
                }
            },
            {returnDocument: 'after'}
        );

        return successResponse(res, {
            statusCode: 200, 
            message: 'Request Rejected Successful',
            payload: updatedWithdrawData,
        }) 
    } catch (error) { 
        next(error)
    }
};



const handleGetWithdraw =async (req, res, next) => {
    try {
        const id = req.user._id; 
        console.log(id);

        const depositData =await Deposit.find({
            adminId: id,
            paymentType: {$eq: 'withdraw'},
            status: {$eq: 'active'},
        });
        console.log(depositData, 'withdrawData');


        return successResponse(res, {
            statusCode: 200, 
            message: 'deposit return successfully',
            payload: depositData,
        }) 
    } catch (error) { 
        console.log(error);
        next(error);
    }
};


module.exports = {
    handleCreateDeposit,
    handleConfirmDeposit,
    handleRejectDeposit,
    handleGetDeposit,
    handleCreateWithdraw,
    handleConfirmWithdraw,
    handleRejectWithdraw,
    handleGetWithdraw
}