const {User} = require('../models/user');
const {TodayIntake} = require('../models/todayIntake');
const express = require('express');
const Joi = require('joi'); 
const router = express.Router();
const bcrypt = require('bcrypt');
const StaticMethods = require('../StaticMethods.js');

//logovanje korisnika
router.post('/', async (req, res) => {
    //validacija unosa
    const {error} = validate(req.body.user);
    if(error) return res.status(400).send(error.details[0].message);

    //provera da li korisnik postoji
    let user = await User.findOne({ email: req.body.user.email });
    if(!user) return res.status(400).send('Nepravilno unet email ili lozinka.');

    //komparacija passworda trazenog korisnika iz baze i unetog passworda
    const validPassword = await bcrypt.compare(req.body.user.password, user.password);
    if(!validPassword) return res.status(400).send('Nepravilno unet email ili password');

    //provera da li postoji lista za današnji unos nutrijenata - todays intakes
    //naci da li postoji intake sa danasnjim datumom i emailom korisnika koji se loguje
    const today = StaticMethods.getCurrentDate();

    const todaysIntakes = await TodayIntake.find({ date: today, email: user.email});
    if(!todaysIntakes.length){
        let todayIntake = new TodayIntake({
            email: user.email,
            date: today,
            todayCalsIntake: 0,
            todayCarbsIntake: 0,
            todayFatsIntake: 0,
            todayProteinsIntake: 0
        });
        await todayIntake.save();
    }

    // json web token ( payload, secret/private key)
    const token = user.generateAuthToken(); 
    
    return res.status(200).json({
        title:'login success',
        token:token
    })
});

//fja za validaciju u kojoj proveravamo samo email i password korisnika
function validate(req){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required(),
    })
    return schema.validate(req);
}

module.exports = router;