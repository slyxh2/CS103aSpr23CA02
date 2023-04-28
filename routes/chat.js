const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const User = require('../models/User')

const isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}
const configuration = new Configuration({
    apiKey: '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'
});
const openai = new OpenAIApi(configuration);
router.get('/form/:id', isLoggedIn, async (req, res, next) => {
    const id = req.params.id;
    console.log(id);
    const user = await User.findById(id);
    console.log(user);
    res.render('form', { chat: user.chat });
});
router.post('/ask', async (req, res, next) => {
    const { content, id } = req.body;
    await User.findByIdAndUpdate(id, {
        $addToSet: { chat: content }
    })
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: content,
    });
    console.log(completion.data.choices);
    res.json({ res: completion.data.choices[0].text });
})
module.exports = router;


