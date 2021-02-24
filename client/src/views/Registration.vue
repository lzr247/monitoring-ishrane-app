<template>
  <div class="Registration">
    <v-img 
    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    id="pozadina"
    ></v-img>

    <v-container id="mainSection" class='rounded-0'>
      <v-row id="red">
        <v-col cols="12" id="kolona">
          <div>
            <h1>- Unesite vaše podatke -</h1>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
            >
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
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[rules.passwordRequired,rules.passwordRules]"
                label="Lozinka"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show"
              ></v-text-field>

              <!-- pol i godina rodjenja -->
              <v-row style="width:100%;">
                <v-col cols="12" sm="4">
                  <p>Pol:</p>
                  <v-radio-group
                    v-model="gender"
                    column
                    mandatory
                  >
                    <v-radio
                      label="Muški"
                      value="male"
                    ></v-radio>
                    <v-radio
                      label="Ženski"
                      value="female"
                    ></v-radio>
                  </v-radio-group>
                </v-col>

                <!-- DATUM RODJENJA -->
                <v-col cols="12" sm="8">
                  <p>Unesite godinu rođenja:</p>
                  <v-select
                    v-model="birthYear"
                    :items="years"
                    menu-props="auto"
                    label="Godine"
                    hide-details
                    prepend-icon="mdi-calendar-month"
                    single-line
                  ></v-select>
                </v-col>
              </v-row>

              <!-- visina i tezina -->
              <v-row style="width:100%;">
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

              <v-row style="width:100%;">
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
                style="width:92%;"
              ></v-select>

              <v-checkbox
                v-model="checkbox"
                :rules="[v => !!v || 'Morate se složiti da biste nastavili.']"
                label="Proverili ste sve unose i želite da se registrujete."
                required
              ></v-checkbox>
              <v-alert dense outlined type="error" v-if="this.errorMessage">{{this.errorMessage}}</v-alert>
              <v-btn
                color="primary"
                class="mt-4 mb-4"
                @click="validate"
              >
                Registracija
              </v-btn>

            </v-form>
          </div>

        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
    name:"Registration",
    data: () => ({
      errorMessage:'',
      show: false,
      valid: true,
      name: '',
      surname: '',
      email: '',
      password: '',
      height:0,
      weight:0,
      gender: null,
      birthYear: null,
      years:[],
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

    }),
    created(){
    if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== ''){
        this.$router.push('/dashboard');
      }
    },
    methods: {
      async validate () {
        if(this.$refs.form.validate()){
          axios.post('/api/users', { 
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            height: this.height,
            weight: this.weight,
            gender: this.gender,
            birthYear: this.birthYear,
            goal: this.goal,
            lostGainKg: this.lostGainKg,
            dietPlan: this.dietPlan
           })
          .then( res => {
            if(res.status === 201){
              localStorage.setItem('token', res.data.token);
              this.$router.push('/dashboard');
            }
          })
          .catch(error => {
            if(error.response){
              this.errorMessage = error.response.data;
            }
          })
        }
      },
    },
    mounted() {
      //dodavanje godina u select
      var d = new Date();
      var y = d.getFullYear();
      var i=y-14;
      for(i;i>1900;i--){
        this.years.push(i);
      }
    }
}
</script>
<style lang="scss" scoped>
  #drugoDugme{
    color:white!important;
  }
  #pozadina{
    height: 100vh;
    opacity: 0.75;
    position: relative;
    z-index: 1;
  }

  #mainSection{
    position: absolute;
    top:50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 50%;
    z-index: 2;
    background-color: white;
    box-shadow: 0 0 50px rgb(0, 0, 0);
    border-radius: 5px;

    h1{
      font-family: 'Yusei Magic', sans-serif;
      font-size: 36px;
      text-align: center;
      margin: 10px 0;
    }

    #kolona{
      display: flex;
      justify-content: center;
      align-items: center;

      div{
        width: 90%;
        margin-right: auto!important;
        margin-left: auto!important;
        text-align: center;
      }
    }
  }

  @media screen and(max-width:850px){
    #mainSection{
      max-width: 80%;
      margin: 10px 0;
      height: 100%;
      overflow: auto!important;
    }

  }
  @media screen and(max-height:850px){
    #mainSection{
      height: 100%;
      overflow: auto!important;
    }
  }

  @media screen and(max-width:600px){
    #mainSection{
      max-width: 95%;
    }
  }
  
</style>