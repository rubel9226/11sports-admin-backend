const { Schema, model } = require("mongoose"); 

const transactionHistorySchema = new Schema(
  {
    adminIds: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Users",
        }], 
        default: null,
    },
    type: {
        type: String,
        default: null
    },
    amount: {
        type: Number,
        default: 0
    },
    deposit: {
        type: Number,
        default: 0
    },
    withdraw: {
        type: Number,
        default: 0
    },
    fromAdminName: {
        type: String,
        default: null
    },
    fromAdminRole: {
        type: String,
        default: null
    },
    balance: {
        type: Number,
        default: 0
    }
  },
  {
    timestamps: true,
  }
);

const TransactionHistory = model("transaction-history", transactionHistorySchema);

module.exports = TransactionHistory;