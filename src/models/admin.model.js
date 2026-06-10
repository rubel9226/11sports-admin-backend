const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Admin id is required.'],
      ref: "Users",
      default: null,
    },
    refer: {
      type: String,
      trim: true,
      unique: [true, 'refer code already exist']
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [ /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email" ]
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: [true, "User name already exist"],
      lowercase: true,
      minlength: [3, "User name can be minimum 3 characters"],
      maxlength: [31, "User name can be maximum 31 characters"],
    },
    fullName: {
      type: String,
      trim: true,
      lowercase: true,
      default: function () {
        return this.userName;
      },
    },

    phone: {
      type: String,
      trim: true,
      minlength: [10, "Phone can be minimum 10 characters"],
      maxlength: [11, "Phone can be maximum 11 characters"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password can be minimum 6 characters long."],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },

    balance: {
      type: Number,
      default: 0,
    },

    exposure: {
      type: Number,
      default: 0,
    },

    isCasino: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: [
        'active',
        'suspend',
        'locked'
      ]
    },

    role: {
      type: String,

      enum: [
        "white_level",
        "super_admin",
        "admin",
        "senior_super",
        "super",
        "agent",
        "user",
      ],

      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = model("Users", adminSchema);

module.exports = Admin;