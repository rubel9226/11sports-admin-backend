const createError = require("http-errors");

const { successResponse } = require("./response.controllers");
const Admin = require("../models/admin.model");



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
        console.log(newRole)


        const isValid = ['userName', 'fullName', 'email', 'phone', 'password'];
        isValid.map((value) => {
            if(req.body[value]){
                data[value] = req.body[value]
            }
        });

        console.log(data)
        const newUser =await Admin.create(data);

        return successResponse(res, {
            statusCode: 200,
            message: 'Admin is Create successfully.',
            payload: newUser
        });
    } catch (error) {
        next(error);
    }

};


// get admins
const handleGetAdmins =async (req, res, next) => {
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




module.exports = {
    handleAddAdmin,
    handleGetAdmins, 
    handleGetBalance
    
}