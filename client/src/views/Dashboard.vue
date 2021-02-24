<template>
    <div class="Dashboard">
        <Navigation/>
        <v-main>
            <v-container>

                <div class="d-flex flex-row justify-center">
                    <span class="white--text text-h4 font-weight-medium text-center py-3 ml-1">Dobrodošli nazad, {{this.name}} {{this.surname}}</span>
                </div>

                <v-row>
                    <v-col cols="12">
                        <div class="pa-5 py-8" style="background:#f9f9f9;">
                            <v-row>
                                <v-col cols="12" class="d-flex justify-space-around flex-row align-center">
                                    <span class="text-h5"> Vaš plan ishrane: {{this.nutritionArray[0]}}</span>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="d-flex justify-space-around flex-row align-center">
                                        <span style="background-color:#cc9900;border-radius:20px;margin-left:0px" class="px-5 py-4">{{this.nutritionArray[1]}}</span>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="d-flex justify-space-around flex-row align-center">
                                        <span style="background-color:lightblue;border-radius:20px;margin-left:0px" class="px-5 py-4">{{this.nutritionArray[2]}}</span>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="4">
                                    <div class="d-flex justify-space-around flex-row align-center">
                                        <span style="background-color:#E76F51;border-radius:20px;margin-left:0px" class="px-5 py-4">{{this.nutritionArray[3]}}</span>
                                    </div>
                                </v-col>

                                <v-col cols="12">
                                    <v-row class="pa-3 ma-0" style="background:#f1f1f1;">
                                        <v-col cols="12" sm="4" class="mt-1" :class="{ goodIntake : goodIntakeCals, badIntake: !goodIntakeCals }">
                                            Danas ste uneli {{this.todaysIntakeCals}}/{{ this.maxIntakeCals }} kcal. 
                                        </v-col>
                                        <v-col cols="12" sm="8">
                                            <v-progress-linear color="#2A9D8F" height="30" :value="this.todaysIntakeCals/this.maxIntakeCals*100" striped></v-progress-linear>
                                        </v-col>
                                    </v-row>
                                </v-col>

                                <v-col cols="12">
                                    <div style="background-color:#f1f1f1;">
                                        <v-row class="pa-3 ma-0">
                                            <v-col cols="12" sm="4" class="mt-0 mt-sm-1" :class="{ goodIntake : goodIntakeProteins, badIntake: !goodIntakeProteins }">
                                                Današnji unos proteina {{this.todaysIntakeProteins}}/{{ this.maxIntakeProteins }}g:
                                            </v-col>
                                            <v-col cols="12" sm="8">
                                                <v-progress-linear color="#2A9D8F" height="30" striped :value="this.todaysIntakeProteins/this.maxIntakeProteins*100"></v-progress-linear>
                                            </v-col>
                                        </v-row>
                                        <v-row class="pa-3 ma-0">
                                            <v-col cols="12" sm="4" class="mt-0 mt-sm-1" :class="{ goodIntake : goodIntakeCarbs, badIntake: !goodIntakeCarbs }">
                                                Današnji unos hidrata {{this.todaysIntakeCarbs}}/{{ this.maxIntakeCarbs }}g:
                                            </v-col>
                                            <v-col cols="12" sm="8">
                                                <v-progress-linear color="#2A9D8F" height="30" striped :value="this.todaysIntakeCarbs/this.maxIntakeCarbs*100"></v-progress-linear>
                                            </v-col>
                                        </v-row>
                                        <v-row class="pa-3 ma-0">
                                            <v-col cols="12" sm="4" class="mt-0 mt-sm-1" :class="{ goodIntake : goodIntakeFats, badIntake: !goodIntakeFats }">
                                                Današnji unos masti {{this.todaysIntakeFats}}/{{ this.maxIntakeFats }}g:
                                            </v-col>
                                            <v-col cols="12" sm="8">
                                                <v-progress-linear color="#2A9D8F" height="30" striped :value="this.todaysIntakeFats/this.maxIntakeFats*100"></v-progress-linear>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-col>

                            </v-row> 
                        </div>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" 
                            v-for="(meal,index) in mealList"
                            :key="index">
                        
                        <div v-if="meal.length!=0">
                            <v-simple-table dense class="rounded-0 px-2 py-3">
                                <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th>
                                            <h1 v-if="index==0">Doručak</h1>
                                            <h1 v-if="index==1">Ručak</h1>
                                            <h1 v-if="index==2">Užina</h1>
                                            <h1 v-if="index==3">Večera</h1>
                                        </th>
                                    </tr>
                                    <tr>
                                    <th class="text-left">
                                        Naziv:
                                    </th>
                                    <th class="text-left">
                                        Gramaža:
                                    </th>
                                    <th class="text-left">
                                        Kalorija:
                                    </th>
                                    <th class="text-left">
                                        Proteini:
                                    </th>
                                    <th class="text-left">
                                        Hidrati:
                                    </th>
                                    <th class="text-left">
                                        Masti:
                                    </th>
                                    <th class="text-left">
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                    index
                                    v-for="(obrok, index) in meal"
                                    :key="index"
                                    >
                                    <td>{{ obrok.name }}</td>
                                    <td>{{ obrok.weight }}</td>
                                    <td>{{ obrok.energy }}</td>
                                    <td>{{ obrok.proteins }}</td>
                                    <td>{{ obrok.carbs }}</td>
                                    <td>{{ obrok.fat }}</td>
                                    <td><v-btn x-small @click="deleteMeal(obrok, mealList.indexOf(meal))">Izbaci {{obrok.name}}</v-btn></td>
                                    </tr>
                                </tbody>
                                </template>
                            </v-simple-table>
                        </div>
                        <div v-else>
                            <v-alert v-if="index==0" class="ma-0 rounded-0" dismissible  border="left" colored-border color="#2A9D8F">Danas niste uneli doručak.</v-alert>
                            <v-alert v-if="index==1" class="ma-0 rounded-0" dismissible  border="left" colored-border color="#2A9D8F">Danas niste uneli ručak.</v-alert>
                            <v-alert v-if="index==2" class="ma-0 rounded-0" dismissible  border="left" colored-border color="#2A9D8F">Danas niste uneli užinu.</v-alert>
                            <v-alert v-if="index==3" class="ma-0 rounded-0" dismissible  border="left" colored-border color="#2A9D8F">Danas niste uneli večeru.</v-alert>
                        </div>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import axios from 'axios';
import Navigation from '../components/Navigation';
export default {
    name: 'Dashboard',
    components:{
        Navigation
    },
    data(){
        return{
            dorucakList: [],
            rucakList: [],
            veceraList: [],
            uzinaList: [],
            mealList:[],
            name:'',
            surname: '',
            dietPlan:'',
            dietDescription:'',
            maxIntakeCals: 0,
            maxIntakeCarbs: 0,
            maxIntakeProteins: 0,
            maxIntakeFats: 0,
            todaysIntakeCals: 0,
            todaysIntakeCarbs: 0,
            todaysIntakeProteins: 0,
            todaysIntakeFats: 0,
            nutritionArray: [],
        }
    },
    created(){
        if(localStorage.getItem('token') === null || localStorage.getItem('token') == ''){
            this.$router.push('/');
        }
    },
    mounted() {
        axios.get('/api/users/me', { headers: {token: localStorage.getItem('token') }})
             .then(res => {
                this.name = res.data.name;
                this.surname = res.data.surname;
                this.dietPlan = res.data.dietPlan;
                this.dietDescription = res.data.dietDescription;
                this.maxIntakeCals = res.data.maxIntakeCals;
                this.maxIntakeCarbs = res.data.maxIntakeCarbs;
                this.maxIntakeProteins = res.data.maxIntakeProteins;
                this.maxIntakeFats = res.data.maxIntakeFats;
                let indexCrte = this.dietPlan.indexOf('-');
                let indexZareza = this.dietPlan.indexOf(',')
                let indexPoslednjegZareza = this.dietPlan.lastIndexOf(',');
                let prviEl = this.dietPlan.slice(0, indexCrte);
                let drugiEl = this.dietPlan.slice(indexCrte+1, indexZareza);
                let treciEl = this.dietPlan.slice(indexZareza+1, indexPoslednjegZareza);
                let cetvrtiEl = this.dietPlan.slice(indexPoslednjegZareza+1, this.dietPlan.length);
                this.nutritionArray.push(prviEl.trim().toLowerCase())
                this.nutritionArray.push(drugiEl.trim())
                this.nutritionArray.push(treciEl.trim())
                this.nutritionArray.push(cetvrtiEl.trim())
             })
             .catch( err => {
                 console.log(err.data);
             })
        axios.get('/api/todaysIntakes', { headers: {token: localStorage.getItem('token') }})
             .then( res=> {
                 this.todaysIntakeCals = res.data.todayCalsIntake;
                 this.todaysIntakeCarbs = res.data.todayCarbsIntake;
                 this.todaysIntakeProteins = res.data.todayProteinsIntake;
                 this.todaysIntakeFats = res.data.todayFatsIntake;
             })
            .catch( err => {
                 console.log(err.data);
             })
        axios.get('/api/foodPerDay', { headers: {token: localStorage.getItem('token') }})
             .then( res => {
                for( let i=0; i < res.data.length; i++ ){
                    if(res.data[i].meal == "Doručak"){
                    this.dorucakList = res.data[i].foodList;
                    }
                    if(res.data[i].meal == "Ručak"){
                    this.rucakList = res.data[i].foodList;
                    }
                    if(res.data[i].meal == "Večera"){
                    this.veceraList = res.data[i].foodList;
                    }
                    if(res.data[i].meal == "Užina"){
                    this.uzinaList = res.data[i].foodList;
                    } 
                }
                this.mealList.push(this.dorucakList);
                this.mealList.push(this.rucakList)
                this.mealList.push(this.uzinaList)
                this.mealList.push(this.veceraList)
             })
            .catch( err => {
                 console.log(err.data);
             })
    },
    methods: {
        deleteMeal(obrok, brojObroka){
            let nazivObroka = '';
            if(brojObroka == 0){
                nazivObroka = "Doručak";
            }else if(brojObroka == 1){
                nazivObroka = "Ručak";
            }else if(brojObroka == 2){
                nazivObroka = "Užina";
            }else if(brojObroka == 3){
                nazivObroka = "Večera";
            }else{
                console.log("Nepravilan unos");
                return;
            }
            axios.delete('/api/foodPerDay',{ headers: {token: localStorage.getItem('token')},
                data: { 
                    food: obrok,
                    meal: nazivObroka
                }} )
            .then( res => {
                if(brojObroka == 0){
                    this.dorucakList = res.data.foodList;
                }else if(brojObroka == 1){
                    this.rucakList = res.data.foodList;
                }else if(brojObroka == 2){
                    this.uzinaList = res.data.foodList;
                }else if(brojObroka == 3){
                    this.veceraList = res.data.foodList;
                }else{
                    console.log("Nepravilan unos");
                    return;
                }
                this.mealList = [];
                this.mealList.push(this.dorucakList);
                this.mealList.push(this.rucakList);
                this.mealList.push(this.uzinaList);
                this.mealList.push(this.veceraList);
                this.updateIntakes();
            })
            .catch( err => {
                 console.log(err.data);
             })
        },
        updateIntakes(){
            axios.get('/api/todaysIntakes', { headers: {token: localStorage.getItem('token') }})
                 .then( res=> {
                 this.todaysIntakeCals = res.data.todayCalsIntake;
                 this.todaysIntakeCarbs = res.data.todayCarbsIntake;
                 this.todaysIntakeProteins = res.data.todayProteinsIntake;
                 this.todaysIntakeFats = res.data.todayFatsIntake;
                 })
                 .catch( err => {
                    console.log(err.data);
                 })
        }
    },
    computed:{
        goodIntakeProteins: function(){
            if(this.todaysIntakeProteins == 0){
                return false;
            }
            else if(this.todaysIntakeProteins > 0 && this.todaysIntakeProteins <= this.maxIntakeProteins){
                return true;
            }else{
                return false;
            }
        },
        goodIntakeCarbs: function(){
            if(this.todaysIntakeCarbs == 0){
                return false;
            }
            else if(this.todaysIntakeCarbs > 0 && this.todaysIntakeCarbs <= this.maxIntakeCarbs){
                return true;
            }else{
                return false;
            }
        },
        goodIntakeFats: function(){
            if(this.todaysIntakeFats == 0){
                return false;
            }
            else if(this.todaysIntakeFats > 0 && this.todaysIntakeFats <= this.maxIntakeFats){
                return true;
            }else{
                return false;
            }
        },
        goodIntakeCals: function(){
            if(this.todaysIntakeCals == 0){
                return false;
            }else if( this.todaysIntakeCals > 0 && this.todaysIntakeCals <= this.maxIntakeCals){
                return true;
            }else{
                return false;
            }
        },
    }
};
</script>

<style lang="scss" scoped>
    #app > div > main{
        background: #83C5BE;
        min-height: 100vh;
    }
    span{
        font-family: 'Yusei Magic', sans-serif!important;
    }
    .goodIntake{
        border-left: 5px solid #2A9D8F;
    }
    .badIntake{
        border-left: 5px solid #E76F51;
    }
    #app > div > main > div > div > div > span{
        font-family: 'Yusei Magic', sans-serif!important;
    }
</style>