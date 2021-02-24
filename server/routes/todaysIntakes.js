const {TodayIntake} = require('../models/todayIntake');
const express = require('express');
const router = express.Router();
const StaticMethods = require('../StaticMethods.js');
const {auth} = require('../middleware/authUser')

router.get('/', auth,  async (req, res) => {
    let today = StaticMethods.getCurrentDate();
    try{
        const todaysIntakes = await TodayIntake.find({ email:req.user.email, date:today}).select('-email');
        if(todaysIntakes.length == 0){
            let todayIntake = new TodayIntake({
                email: req.user.email,
                date: today,
                todayCalsIntake: 0,
                todayCarbsIntake: 0,
                todayFatsIntake: 0,
                todayProteinsIntake: 0
            });
            await todayIntake.save();
            return res.send(todayIntake);
        }
        return res.send(todaysIntakes[0]);
    }catch(err){
        return res.send(400).send(err);
    }
})

router.get('/all', auth, async (req, res) => {
    try{
        const todaysIntakes = await TodayIntake.find({ email: req.user.email}).select('-email');
        return res.send(todaysIntakes);
    }catch(err){
        return res.status(400).send(err);
    }
});

async function updateTodaysIntakes(sumEnergy, sumProteins, sumCarbs, sumFats, email){
    let today = StaticMethods.getCurrentDate();
    const todaysIntakes = await TodayIntake.findOneAndUpdate({ email:email, date: today},{
        todayCalsIntake: sumEnergy,
        todayCarbsIntake: sumCarbs,
        todayFatsIntake: sumFats,
        todayProteinsIntake: sumProteins
    },{ new:true });
    if(!todaysIntakes) return "Greška sa osvežavanjem liste unosa nutrijenata.";
    return true;
}

module.exports = router;
module.exports.updateTodaysIntakes = updateTodaysIntakes; 