const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const depositSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Admin id is required.'],
      ref: "Users",
      default: null,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required.'],
      ref: "Users",
      default: null,
    },
    paymentType: {
      type: String,
      required: [true, 'Payment type is required.'],
      default: ''
    },
    userName: {
      type: String,
      required: [true, "User name is required."],
      trim: true,
      lowercase: true, 
    },
    txnId: {
      type: String,
      unique: [true, "transaction id already exist"],
      trim: true, 
    },
    image: {
      type: String, 
    },
    agentName: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
      lowercase: true, 
    },
    accountName: {
      type: String, 
      trim: true,
      lowercase: true, 
    },
    accountNumber: {
      type: Number,
      required: [true, "Account number is required"],
      trim: true,
    },
    accountType: {
      type: String,
      required: [true, "Account type is required"],
      trim: true,
      lowercase: true, 
    },
    IFSC_Code: {
      type: String, 
      trim: true,
    },
    holderName: {
      type: String, 
      trim: true,
      lowercase: true, 
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      trim: true,
    },
    status: {
        type: String,
        default: 'active'
    }
  },
  {
    timestamps: true,
  }
);

const Deposit = model("deposit", depositSchema);

module.exports = Deposit;