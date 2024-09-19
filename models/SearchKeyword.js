"use strict";

const mongoose = require("mongoose");

const SearchKeywordSchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    searchCount: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

// Create a unique index on the 'keyword' field
SearchKeywordSchema.index({ keyword: 1 }, { unique: true });

module.exports = mongoose.model("SearchKeyword", SearchKeywordSchema);
