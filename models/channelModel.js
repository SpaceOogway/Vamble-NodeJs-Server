const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    channelName: {
      type: String,
      unique: true
    },
    channelIconAddress: {
      type: String,
      unique: true,
    },
    channelAddress: {
      type: String,
      unique: true,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  });