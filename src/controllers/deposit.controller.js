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



const handleGetDeposit =async (req, res, next) => {
    try {
        const id = req.user._id; 
        console.log(id);

        const depositData =await Deposit.find({
            adminId: id,
            paymentType: {$eq: 'deposit'}
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

const handleGetWithdraw =async (req, res, next) => {
    try {
        const id = req.user._id; 
        console.log(id);

        const depositData =await Deposit.find({
            adminId: id,
            paymentType: {$eq: 'withdraw'}
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
    handleGetDeposit,
    handleCreateWithdraw, 
    handleGetWithdraw
}