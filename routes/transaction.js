const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');


const isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

router.get('/transaction', isLoggedIn,
    async (req, res, next) => {
        const { sortBy } = req.query;
        let result;

        if (sortBy === 'category') {
            result = await Transaction.find({}).sort({ category: 1 })

        } else if (sortBy === 'amount') {
            result = await Transaction.find({}).sort({ amount: 1 })

        } else if (sortBy === 'description') {
            result = await Transaction.find({}).sort({ description: 1 })
        } else if (sortBy === 'date') {
            result = await Transaction.find({}).sort({ date: 1 })
        } else {
            result = await Transaction.find({})
        }
        console.log(result);
        res.render('transaction', { transactions: result });
    })

router.post('/add-transaction', isLoggedIn,
    async (req, res, next) => {
        console.log(req.body);
        const { description, category, amount, date } = req.body
        const trans = new Transaction({
            description,
            category,
            amount: parseInt(amount),
            date: new Date(date)
        })
        await trans.save();
        res.redirect('/transaction');
    })

router.get('/transaction/byCategory', isLoggedIn,
    async (req, res, next) => {
        let result = await Transaction.aggregate([{
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$amount" }
            }
        }])
        res.render('groupByCategory', { result });
    })

router.get('/transaction/remove/:id', isLoggedIn,
    async (req, res, next) => {
        await Transaction.deleteOne({ _id: req.params.id });
        res.redirect('/transaction')
    }
)

router.get('/transaction/edit/:id', isLoggedIn,
    async (req, res, next) => {
        let transaction = await Transaction.findById(req.params.id);
        console.log(transaction);
        res.render('editTransaction', { transaction })
    }
)

router.post('/transaction/edit/:id', isLoggedIn,
    async (req, res, next) => {

        const { description, category, amount, date } = req.body;
        await Transaction.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    description,
                    category,
                    amount: parseInt(amount),
                    date: new Date(date)
                }
            }
        )
        res.redirect('/transaction')
    }
)

module.exports = router;