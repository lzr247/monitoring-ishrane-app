const {FoodPerDay, validate} = require('../models/foodPerDayModel');
const {validateFood} = require('../models/food');
const express = require('express');
const router = express.Router();
const StaticMethods = require('../StaticMethods.js');
const {updateTodaysIntakes} = require('./todaysIntakes');
const {auth, authHeadersToken, authBodyToken} = require('../middleware/authUser');

router.get('/', auth, async (req, res) => {
    let today = StaticMethods.getCurrentDate();
    let email = req.user.email;
    const meals = await FoodPerDay.find({ email: email, date: today });
    return res.send(meals);
});

router.delete('/', authHeadersToken, async (req, res) => {
    let today = StaticMethods.getCurrentDate();
    let email = req.user.email;

    const {error} = validate({meal: req.body.meal, email: email});
    if(error) return res.status(400).send(error.details[0].message);
    
    const foodPerDay = await FoodPerDay.findOne({ email: email, date: today, meal: req.body.meal})
    let index = 0;
    for(food of foodPerDay.foodList){
        if(food.weight==req.body.food.weight && food.name==req.body.food.name){
            index = foodPerDay.foodList.indexOf(food);
            break;
        }
    }
    foodPerDay.foodList.splice(index, 1);
    await foodPerDay.save();

    sumNutrients(today, email);

    return res.send(foodPerDay);
})

router.post('/', authBodyToken, async (req, res) => {
    let today = StaticMethods.getCurrentDate();
    let email = req.user.email;

    const {error} = validate({meal: req.body.meal, email: email});
    if(error) return res.status(400).send(result.error.details[0].message);

    let weight = req.body.weight;
    let energy = parseFloat(req.body.food.energy * weight / 100).toFixed(2);
    let proteins = parseFloat(req.body.food.proteins * weight / 100).toFixed(2);
    let carbs = parseFloat(req.body.food.carbs * weight / 100).toFixed(2);
    let fat = parseFloat(req.body.food.fat * weight / 100).toFixed(2);

    const food = {
        "_id": req.body.food._id,
        "image": req.body.food.image,
        "name": req.body.food.name,
        "weight": weight,
        "energy": energy,
        "energyUnit": req.body.food.energyUnit,
        "proteins": proteins,
        "carbs": carbs,
        "fat": fat,
        "weightUnit": req.body.food.weightUnit,
        "category": req.body.food.category
    }

    //provera da li postoje datum i obrok u listi 
    let foodPerDay = await FoodPerDay.find({ date: today, meal: req.body.meal, email: email });
    //ako ne postoji
    if(foodPerDay === undefined || foodPerDay.length == 0) {
        // pravimo bazu
        foodPerDay = new FoodPerDay({
            "email": email,
            "meal": req.body.meal,
            "date": today,
            "foodList": food
        });
        await foodPerDay.save();
        res.status(200).send("Uspešan unos hrane!")
    }else{
        const foodPerDay = await FoodPerDay.updateOne({ date: today, meal: req.body.meal, email: email }, 
            { $push: {"foodList":food}})
        if(!foodPerDay) return res.status(400).send("Greška! Hrana nije dodata u bazu podataka.")
        res.status(200).send("Uspešan unos hrane!")
    }
    //pozvati funkciju za sabiranje nutrijenata i u njoj update danasnji unos nutrijenata za korisnika
    sumNutrients(today, email);
});

router.post('/customMeal', authBodyToken, async (req, res) => {
    const {error} = validateFood(req.body.food);
    if(error) return res.status(400).send(error.details[0].message);

    let today = StaticMethods.getCurrentDate();
    let email = req.user.email;

    let foodPerDay = await FoodPerDay.find({ date: today, meal: req.body.meal, email: email });

    if(foodPerDay === undefined || foodPerDay.length == 0) {
        foodPerDay = new FoodPerDay({
            "email": email,
            "meal": req.body.meal,
            "date": today,
            "foodList": req.body.food
        });
        await foodPerDay.save();
        res.status(200).send("Uspešan unos hrane!")
    }else{
        const foodPerDay = await FoodPerDay.updateOne({ date: today, meal: req.body.meal, email: email }, 
            { $push: {"foodList":req.body.food}})
        if(!foodPerDay) return res.status(400).send("Greška! Hrana nije dodata u bazu podataka.")
        res.status(200).send("Uspešan unos hrane!")
    }
    sumNutrients(today, email);
});

async function sumNutrients(today, email){
    let foodPerDayArray = await FoodPerDay.find({ date: today, email: email});

    let dorucakEnergy = 0;
    let dorucakProteins = 0;
    let dorucakCarbs = 0;
    let dorucakFats = 0;
    let rucakEnergy = 0;
    let rucakProteins = 0;
    let rucakCarbs = 0;
    let rucakFats = 0;
    let uzinaEnergy = 0;
    let uzinaProteins = 0;
    let uzinaCarbs = 0;
    let uzinaFats = 0;
    let veceraEnergy = 0;
    let veceraProteins = 0;
    let veceraCarbs = 0;
    let veceraFats = 0;

    for(let food of foodPerDayArray){
        if(food.meal == "Doručak"){
            for( let i=0; i<food.foodList.length; i++){
                dorucakEnergy += food.foodList[i].energy;
                dorucakCarbs += food.foodList[i].carbs;
                dorucakProteins += food.foodList[i].proteins;
                dorucakFats += food.foodList[i].fat;
            }
        }
        if(food.meal == "Ručak"){
            for( let i=0; i<food.foodList.length; i++){
                rucakEnergy += food.foodList[i].energy;
                rucakCarbs += food.foodList[i].carbs;
                rucakProteins += food.foodList[i].proteins;
                rucakFats += food.foodList[i].fat;
            }
        }
        if(food.meal == "Užina"){
            for( let i=0; i<food.foodList.length; i++){
                uzinaEnergy += food.foodList[i].energy;
                uzinaCarbs += food.foodList[i].carbs;
                uzinaProteins += food.foodList[i].proteins;
                uzinaFats += food.foodList[i].fat;
            }
        }
        if(food.meal == "Večera"){
            for( let i=0; i<food.foodList.length; i++){
                veceraEnergy += food.foodList[i].energy;
                veceraCarbs += food.foodList[i].carbs;
                veceraProteins += food.foodList[i].proteins;
                veceraFats += food.foodList[i].fat;
            }
        }
    }

    let sumEnergy = parseFloat(dorucakEnergy + rucakEnergy + veceraEnergy + uzinaEnergy).toFixed(2);
    let sumProteins = parseFloat(dorucakProteins + rucakProteins + veceraProteins + uzinaProteins).toFixed(2);
    let sumCarbs = parseFloat(dorucakCarbs + rucakCarbs + veceraCarbs + uzinaCarbs).toFixed(2);
    let sumFats = parseFloat(dorucakFats + rucakFats + veceraFats + uzinaFats).toFixed(2);

    updateTodaysIntakes(sumEnergy, sumProteins, sumCarbs, sumFats, email);
}

module.exports = router;