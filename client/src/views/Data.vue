<template>
    <div class="Data">
        <Navigation/>
        <v-main>
            
            <v-card class="mx-auto mt-5 mb-5 pa-3">
                <v-card-text class="text-h5">
                    Izmenite vaše podatke:
                </v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
                    <v-text-field
                        v-model="name"
                        :rules="[rules.nameRequired, rules.nameLength]"
                        label="Ime"
                    ></v-text-field>
                    <v-text-field
                        v-model="surname"
                        :rules="[rules.surnameRequired, rules.surnameLengthMin, rules.surnameLengthMax]"
                        label="Prezime"
                    ></v-text-field>
                    <v-text-field
                        v-model="email"
                        :rules="[rules.emailRequired,rules.emailRules]"
                        label="E-mail"
                        readonly
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        :rules="[rules.passwordRequired,rules.passwordRules]"
                        label="Nova lozinka"
                        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show ? 'text' : 'password'"
                        @click:append="show = !show"
                    ></v-text-field>
                    <v-row>
                        <v-col cols="12" sm="6">
                        <v-text-field
                        label="Visina"
                        v-model="height"
                        type="number"
                        :rules="[rules.heightRequired,rules.heightMin, rules.heightMax]"
                        ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                        <v-text-field
                        label="Težina"
                        v-model="weight"
                        type="number"
                        :rules="[rules.weightRequired, rules.weightMin, rules.weightMax]"
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6">
                        <v-select
                        v-model="goal"
                        :items="itemsGoal"
                        label="Cilj treninga"
                        :rules="[rules.goalTreningRequired]"
                        >
                        </v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                        <v-text-field
                        label="Težina koju želite izgubiti/dobiti"
                        v-model="lostGainKg"
                        type="number"
                        :rules="[rules.lostGainKgRequired,rules.lostGainKgNegative, rules.lostGainKgMax]"
                        ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-select
                        v-model="dietPlan"
                        :items="dietPlans"
                        label="Izaberite plan ishrane"
                        :rules="[rules.dietPlanRequired]"
                    ></v-select>
                    <v-checkbox
                        v-model="checkbox"
                        :rules="[v => !!v || 'Morate se složiti da biste nastavili.']"
                        label="Proverili ste sve unose i želite da se registrujete."
                        required
                    ></v-checkbox>
                    <div class="text-center">
                        <v-btn
                        color="#2A9D8F"
                        class="mt-4 mb-4 white--text"
                        align="center"
                        @click="validate"
                        >
                        Izmeni podatke
                    </v-btn>
                    </div>

                </v-form>
            </v-card>
            <v-snackbar v-model="snackbar" :timeout="timeout">
                <p>Uspesno ste dodali ažurirali podatke!</p>
            </v-snackbar>
        </v-main>
    </div>
</template>

<script>
import Navigation from '../components/Navigation';
import axios from 'axios';
export default {
    name: 'Data',
    components:{
        Navigation
    },
    data() {
        return {
            snackbar:false,
            timeout: 2000,
            show: false,
            valid: true,
            id:'',
            name:'',
            surname:'',
            email:'',
            password:'',
            height:0,
            weight:0,
            goal: null,
            itemsGoal:[
                'Smanjivanje kilaže',
                'Održavanje kilaže',
                'Dodavanje kilaže',
            ],
            lostGainKg: 0,
            dietPlan:'',
            dietPlans:[
                'Standardan - 55% hidrata, 15% proteina, 30% masti',
                'Visok unos proteina - 50% hidrata, 25% proteina, 25% masti',
                'Nizak unos hidrata - 35% hidrata, 25% proteina, 40% masti',
                'Atletski - 55% hidrata, 20% proteina, 25% masti',
                'Kardio trening - 60% hidrata, 20% proteina, 20% masti'
            ],
            checkbox: false,
            rules:{
                nameRequired: value => !!value || 'Morate uneti ime.',
                nameLength: value => (value && value.length) <= 15 || 'Ime mora sadržati manje od 15 karaktera.',
                surnameRequired: value => !!value || 'Morate uneti prezime.',
                surnameLengthMin: value => (value && value.length) <= 15 || 'Prezime more sadržati manje od 15 karaktera.', 
                surnameLengthMax: value => (value && value.length) >= 2 || 'Prezime more sadržati više od 2 karaktera.', 
                emailRequired: value => !!value || 'Morate uneti email.',
                emailRules: value => /.+@.+\..+/.test(value) || 'Email nije validno unesen.',
                passwordRequired: value => !!value || 'Morate uneti lozinku.',
                passwordRules: value => (value && value.length) >= 6 || 'Lozinka mora da ima najmanje 6 karaktera.',
                heightRequired: value => !!value || 'Morate uneti visinu.',
                weightRequired: value => !!value || 'Morate uneti težinu.',
                heightMin: value => value>120 || 'Visina mora biti veća od 120cm.',
                weightMin: value => value>30 || 'Težina mora biti veća od 30kg.',
                heightMax: value => value<250 || 'Visina ne sme biti veća od 250cm.',
                weightMax: value => value<250 || 'Težina ne sme biti veća od 250kg.',
                goalTreningRequired: value => !!value || 'Morate izabrati cilj treninga.',
                lostGainKgRequired: value => !!value || 'Morate popuniti polje.',
                lostGainKgMax: value => value<=50 || 'Ne možete dobiti/izgubiti više od 50kg.',
                lostGainKgNegative: value => value>=0 || 'Ne možete uneti negativan broj.',
                dietPlanRequired: value => !!value || 'Morate izabrati plan ishrane.'
            },
        };
    },
    created(){
        if(localStorage.getItem('token') === null || localStorage.getItem('token') == ''){
            this.$router.push('/');
        }
    },
    mounted() {
        axios.get('/api/users/me/data', { headers: { token: localStorage.getItem('token')}})
             .then(res => {
                 this.user = res.data,
                 this.id = res.data._id;
                 this.name = res.data.name;
                 this.surname = res.data.surname;
                 this.email = res.data.email;
                 this.height = res.data.height;
                 this.weight = res.data.weight;
                 this.goal = res.data.goal;
                 this.lostGainKg = res.data.lostGainKg;
                 this.dietPlan = res.data.dietPlan;
             })
             .catch( err => {
                 console.log(err.data);
             })
    },
    methods: {
        validate () {
            if(this.$refs.form.validate()){
            axios.put('/api/users', { headers: {token: localStorage.getItem('token')}, 
                    data:{
                        id: this.id,
                        name: this.name,
                        surname: this.surname,
                        email: this.email,
                        password: this.password,
                        height: this.height,
                        weight: this.weight,
                        goal: this.goal,
                        lostGainKg: this.lostGainKg,
                        dietPlan: this.dietPlan,
                        gender: this.gender
                    }
                })
                .then( res => {
                    if(res.status === 200){
                        this.snackbar = true;
                    }
                }, err => {
                    this.error = err.response.data.error;
                })
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    #app > div > main{
        background: #83C5BE;
        min-height: 100vh;
    }

    #app > div > main > div > div{
        width: 80%!important;
    }
    
    @media screen and(max-width:600px) {
        #app > div > main > div > div{
            width: 95%!important;
        }
    }
</style>