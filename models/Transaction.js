
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var transactionSchema = Schema({
    description: String,
    category: String,
    amount: Number,
    date: Date
});

module.exports = mongoose.model('transaction', transactionSchema);
