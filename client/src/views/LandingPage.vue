<template>
  <div class="LandingPage">

    <v-img 
      src="../assets/bg1.jpg"
      id="pozadina">
    </v-img>

    <v-container class="fill-height" id="mainSection">
        <v-row id="red" class='rounded-0'>
          <v-col cols="12" sm="8" md="8" id="prvaKolona">
            <div>
              <h1 class="mb-5">Dobrodošli nazaaaad</h1>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-text-field
                  v-model="email"
                  :rules="[rules.requiredEmail, rules.emailRules]"
                  label="E-mail"
                  required
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.requiredPassword, rules.passwordLength]"
                  :type="show ? 'text' : 'password'"
                  label="Lozinka"
                  @click:append="show = !show"
                  v-on:keyup.enter="validate"
                ></v-text-field>
                <v-alert dense outlined type="error" v-if="this.errorMessage">{{this.errorMessage}}</v-alert>
                <v-btn
                  @click="validate"
                  class="mt-5"
                >
                  Logovanje
                </v-btn>
                {{error}}
              </v-form>
            </div>
          </v-col>
          <v-col cols="12" sm="4" md="4" id="drugaKolona">
            <div>
              <h1>Nemate nalog?</h1>
              <h2>Registrujte se odmah i krenite da jedete zdravo</h2>
            </div>
            <v-btn 
              id="drugoDugme"
              to="/registration"
            >Registracija</v-btn>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LandingPage',
  data(){
    return{
      errorMessage:'',
      valid:true,
      error:'',
      email: "",
      password: "" ,
      show: false,
      rules: {
        requiredPassword: value => !!value || 'Morate uneti lozinku.',
        passwordLength: value => value.length>=6 || 'Lozinka mora imati najmanje 6 karaktera.',
        requiredEmail: value => !!value || 'Morate uneti email.',
        emailRules: value => /.+@.+\..+/.test(value) || 'Email nije validno unesen.',
      },
    }
  },
  created(){
    if(localStorage.getItem('token') !== null && localStorage.getItem('token')!==''){
        this.$router.push('/dashboard');
    }
  },
  methods:{
    validate(){
      if(this.$refs.form.validate()){
        let user = {
          email: this.email,
          password: this.password
        }
        axios.post('/api/auth', { user })
             .then( res => {
               if(res.status === 200){
                 localStorage.setItem('token', res.data.token);
                 this.$router.push('/dashboard');
               }
             })
             .catch(error => {
               if(error.response) {
                this.errorMessage = error.response.data;
               }})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  //pozadinska slika
  .LandingPage #pozadina{
    height:100vh;
    opacity: 0.75;
    position: relative;
    z-index:1;
  }

  //container
  .LandingPage #mainSection{
    max-width:70%;
    position:absolute;
    top:50%;
    left:50%;
    z-index: 2;
    transform: translate(-50%, -50%);

    #red{
      box-shadow: 0 0 50px rgb(0, 0, 0);
    }
  }

  //PRVA KOLONA
  .LandingPage #mainSection #prvaKolona{
    background-color:white;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;

    button{
      background-color: #007CC7;
      color: white;
      width: 250px;
      border-radius: 50px;
    }
    h1{
      font-size: 36px;
      margin-bottom: 20px;
    }
  }

  *{
    text-align: center;
  }

  h1{
    font-family: 'Yusei Magic', sans-serif;
  }

  //DRUGA KOLONA
  .LandingPage #mainSection #drugaKolona{
    min-height: 500px;
    background: url('../assets/bg2.jpg') no-repeat center;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    h1{
      color: white;
      font-weight: 500;
      font-size: 30px;
    }

    h2{
      color: white;
      font-weight: 500;
    }

    #drugoDugme{
      background-color: inherit;
      color: white!important;
      border: 2px solid white!important;
      border-radius: 50px!important;
    }
    #drugoDugme:hover{
      background-color: white!important;
      color: #007CC7!important;
      border: 2px solid white!important;
      border-radius: 50px!important;
    }

  }

  @media screen and(max-width: 800px){
    .LandingPage #mainSection{
      max-width: 95%;
    }
  }

  @media screen and(max-width:600px){
    .LandingPage #mainSection{
      margin: 10px 0;
      overflow: auto!important;
    }
  }
</style>
