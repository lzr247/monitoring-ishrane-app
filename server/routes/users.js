const {User, validate} = require('../models/user');
const {TodayIntake} = require('../models/todayIntake');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt'); 
const StaticMethods = require('../StaticMethods.js');
const progressRoute = require('./progressRoute.js');
const {auth, authBodyToken} = require('../middleware/authUser');

const dietPlanArray = [
'Standardan - 55% hidrata, 15% proteina, 30% masti',
'Visok unos proteina - 50% hidrata, 25% proteina, 25% masti',
'Nizak unos hidrata - 35% hidrata, 25% proteina, 40% masti',
'Atletski - 55% hidrata, 20% proteina, 25% masti',
'Kardio trening - 60% hidrata, 20% proteina, 20% masti'];

const dietDescriptionArray = [  
"Ova dijeta će vam omogućiti da izgubite kilograme sa dugotrajnim rezultatima, omogućavajući vam da mršavite dok unosite sve potrebne nutrijente. Dijeta je bazirana na balansiranoj, zdravoj hrani u kombinaciji sa smanjenim unosom kalorija i masti.",
"Ova dijeta zadovoljava sve vaše dnevne unose nutrijenata i bazirana je na visokom unosu proteina. Protein pomaže da izgradite jače, mršavije telo i čini vas manje gladnim pa ćete vam tako biti i lakše da podnesete manji unos kalorija ovog plana.",
"Ova dijeta cilja brz i lak gubitak kilograma, iako možda nećete uneti preporučeni dnevni unos nutrijenata. Savetujemo vam da koristite ovaj plan u kraćem periodu, od 6 do 8 nedelja.",
"Ova dijeta je dizajnirana za profesionalne sportiste koji bi želeli da izgrade još mišića da bi poboljšali svoje performanse. Povećan unos proteina će vam pomoći u izgradnji mišića, dok balansiran unos masti i karbohidrata će vam omogućiti potrebnu energiju.",
"Ova dijeta cilja korisnike kardio treninga koji imaju potrebu za dodatnom energijom za kardio trening jakog inteziteta. Velika količina hidrata će vam omogućiti mnogo energije, dok dati unos proteina osigurava da je mišićna masa sasvim korektno održana."];

const dietPlanArrayDetailed = [
    {
      "name":"Standardan - Izdržljiv",
      "carbs":55,
      "proteins":15,
      "fats":30
    },
    {
      "name":"Visok unos proteina",
      "carbs":50,
      "proteins":25,
      "fats":25
    },
    {
      "name":"Nizak unos hidrata",
      "carbs":35,
      "proteins":25,
      "fats":40
    },
    {
      "name":"Atletski",
      "carbs":55,
      "proteins":20,
      "fats":25
    },
    {
      "name":"Kardio trening",
      "carbs":60,
      "proteins":20,
      "fats":20
    }
  ];

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let dietDescription = '';
    for(let i=0;i<dietPlanArray.length;i++){
        if(dietPlanArray[i] == req.body.dietPlan){
            dietDescription = dietDescriptionArray[i];
            break;
        }
    }
    req.body.dietDescription = dietDescription;

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('Korisnik već postoji.');
    
    //izracunavanje max unosa nutrijenata
    let maxIntakeCals=0;
    if(req.body.gender[0].toLowerCase() == 'm'){
        maxIntakeCals = StaticMethods.calculateMaxIntakeCalsM(req.body.weight, req.body.height, req.body.birthYear, req.body.lostGainKg);
    }else{
        maxIntakeCals = StaticMethods.calculateMaxIntakeCalsF(req.body.weight, req.body.height, req.body.birthYear, req.body.lostGainKg);
    }
    let percentageProteins = 0;
    let percentageCarbs = 0;
    let percentageFats = 0;
    for(let i = 0; i < dietPlanArrayDetailed.length; i++){
        if(req.body.dietPlan.substring(0,5) == dietPlanArrayDetailed[i].name.substring(0,5)){
            percentageCarbs = dietPlanArrayDetailed[i].carbs;
            percentageFats = dietPlanArrayDetailed[i].fats;
            percentageProteins = dietPlanArrayDetailed[i].proteins;
            break;
        }
    }
    percentageFats/=100;
    percentageProteins/=100;
    percentageCarbs/=100;
    let maxIntakeFats = StaticMethods.calculateMaxIntakeFats(maxIntakeCals, percentageFats);
    let maxIntakeProteins = StaticMethods.calculateMaxIntakeProteins(maxIntakeCals, percentageProteins);
    let maxIntakeCarbs = StaticMethods.calculateMaxIntakeCarbs(maxIntakeCals, percentageCarbs);
    req.body.maxIntakeCals = maxIntakeCals;
    req.body.maxIntakeFats = maxIntakeFats;
    req.body.maxIntakeProteins = maxIntakeProteins;
    req.body.maxIntakeCarbs = maxIntakeCarbs;

    user = new User(_.pick(req.body,['name','surname','email','password','gender','birthYear','height','weight','goal','lostGainKg','dietPlan','dietDescription','maxIntakeCals','maxIntakeProteins','maxIntakeFats','maxIntakeCarbs']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();
    const token = user.generateAuthToken();

    //napravio je korisnika i generisao token, napraviti i todayIntake strukturu za korisnika
    let today = StaticMethods.getCurrentDate();

    let todayIntake = new TodayIntake({
        email: user.email,
        date: today,
        todayCalsIntake: 0,
        todayCarbsIntake: 0,
        todayFatsIntake: 0,
        todayProteinsIntake: 0
    });
    await todayIntake.save();

    progressRoute.startWeight(req.body.email, req.body.weight);

    return res.status(201).json({
        title:'Uspešna registracija',
        token:token
    })
});

router.get('/me', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');
        if(!user) return res.status(404).send("Korisnik nije nađen.");
        return res.send(user);
    }catch(err){
        return res.status(400).send(err);
    }
});

router.get('/me/data', auth, async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-maxIntakeCals -maxIntakeCarbs -maxIntakeProteins -maxIntakeFats -password -birthYear -gender');
        if(!user) return res.status(404).send("Korisnik nije nađen");
        return res.send(user);
    }catch(err){
        return res.status(400).send(err);
    }
});

router.put('/', authBodyToken, async (req, res) => {
    let requestedUser = await User.findOne({"_id": req.user._id});
    if(!requestedUser) return res.status(404).send("Traženi korisnik nije nađen.");

    //hashovanje passworda
    const salt = await bcrypt.genSalt(10);
    req.body.data.password = await bcrypt.hash(req.body.data.password,salt);

    let dietDescription = '';
    for(let i=0;i<dietPlanArray.length;i++){
        if(dietPlanArray[i] == req.body.data.dietPlan){
            dietDescription = dietDescriptionArray[i];
            break;
        }
    }
    //izracunavanje max unosa nutrijenata
    let maxIntakeCals=0;
    if(requestedUser.gender[0].toLowerCase() == 'm'){
        maxIntakeCals = StaticMethods.calculateMaxIntakeCalsM(req.body.data.weight, req.body.data.height, requestedUser.birthYear, req.body.data.lostGainKg);
    }else{
        maxIntakeCals = StaticMethods.calculateMaxIntakeCalsF(req.body.data.weight, req.body.data.height, requestedUser.birthYear, req.body.data.lostGainKg);
    }
    let percentageProteins = 0;
    let percentageCarbs = 0;
    let percentageFats = 0;
    for(let i = 0; i < dietPlanArrayDetailed.length; i++){
        if(req.body.data.dietPlan.substring(0,5) == dietPlanArrayDetailed[i].name.substring(0,5)){
            percentageCarbs = dietPlanArrayDetailed[i].carbs;
            percentageFats = dietPlanArrayDetailed[i].fats;
            percentageProteins = dietPlanArrayDetailed[i].proteins;
            break;
        }
    }
    percentageFats/=100;
    percentageProteins/=100;
    percentageCarbs/=100;
    let maxIntakeFats = StaticMethods.calculateMaxIntakeFats(maxIntakeCals, percentageFats);
    let maxIntakeProteins = StaticMethods.calculateMaxIntakeProteins(maxIntakeCals, percentageProteins);
    let maxIntakeCarbs = StaticMethods.calculateMaxIntakeCarbs(maxIntakeCals, percentageCarbs);

    const user = await User.findByIdAndUpdate(req.body.data.id, {
        name: req.body.data.name,
        surname: req.body.data.surname,
        email: req.body.data.email,
        password: req.body.data.password,
        height: req.body.data.height,
        weight: req.body.data.weight,
        goal: req.body.data.goal,
        lostGainKg: req.body.data.lostGainKg,
        dietPlan: req.body.data.dietPlan,
        dietDescription: dietDescription,
        maxIntakeCals: maxIntakeCals,
        maxIntakeProteins: maxIntakeProteins,
        maxIntakeFats: parseInt(maxIntakeFats),
        maxIntakeCarbs: maxIntakeCarbs
    },{ new:true });
    if(!user){
        return res.status(404).send("The user with the given id was not found.");
    }

    //update progress-a
    if(progressRoute.updateWeight(req.body.data.email, req.body.data.weight)){
        res.status(200).send('Uspešna ažuriranje progress baze.')
    }else{
        res.status(200).send('Greška prilikom ažuriranja progress baze.')
    }    
});

module.exports = router;