const { Progress, validate } = require('../models/progressModel');
const express = require('express');
const router = express.Router();
const StaticMethods = require('../StaticMethods.js');
const { auth, authBodyToken } = require('../middleware/authUser');
const { User } = require('../models/user');

router.get('/', auth, async (req, res) => {
    let progress = await Progress.find({ email: req.user.email });
    if (!progress) return res.status(404).send("Nije pronadjena lista napretka korisnika.");
    return res.send(progress);
});

router.post('/', authBodyToken, async (req, res) => {
    //ako postoji danasnji datum - update/ako ne postoji pravimo novi progress
    let today = StaticMethods.getCurrentDate();
    const email = req.user.email;

    let progress = await Progress.find({ date: today, email: email })
    if (progress.length == 0) {
        
        progress = new Progress({
            "email": email,
            "date": today,
            "weight": req.body.data.weight
        })
        await progress.save();

        await User.updateOne({ email: email }, {
            weight: req.body.data.weight
        });

        //poslati sve tezine istog korisnika nazad
        progress = await Progress.find({ email: email })
        return res.status(200).send(progress);
    } else {
        //azuriramo postojeci
        let progress = await Progress.updateOne({ date: today, email: email }, {
            "email": email,
            "date": today,
            "weight": req.body.data.weight
        }, { new: true });
        if (!progress) return res.status(404).send("Greška prilikom ažuriranja.")

        await User.updateOne({ email: email }, {
            weight: req.body.data.weight
        });

        //saljem sve unose ISTOG korisnika na frontend da bih update prikaz
        progress = await Progress.find({ email: email })
        return res.send(progress);
    }
});

async function startWeight(email, weight) {
    let today = StaticMethods.getCurrentDate();
    const progress = new Progress({
        email: email,
        date: today,
        weight: weight
    });
    await progress.save();
    return true;
}

async function updateWeight(email, weight) {
    let today = StaticMethods.getCurrentDate();

    let progress = await Progress.find({ date: today, email: email })
    if (progress.length == 0) {
        progress = new Progress({
            "email": email,
            "date": today,
            "weight": weight
        })
        await progress.save();
        return true;
    } else {
        let progress = await Progress.updateOne({ date: today, email: email }, {
            "email": email,
            "date": today,
            "weight": weight
        }, { new: true });
        if (!progress) return false;
        return true;
    }
}

module.exports = router;
module.exports.startWeight = startWeight;
module.exports.updateWeight = updateWeight;