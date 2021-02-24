<template>
    <div class="AddMeal">
        <v-banner elevation="1" color="#2A9D8F" class="mb-3 white--text rounded-0">
            <v-row>
                <v-col cols="12" sm="1" align="center" justify="center">
                    <v-tooltip v-model="show" bottom>
                        <template v-slot:activator="{attrs}">
                            <v-btn v-bind="attrs" icon class="mt-1" large @click="show = !show">
                                <v-icon color="white">mdi-information-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>U panelu pored možete dodati svoju hranu koja će vam se nakon<br>
                        dodavanja prikazati na glavnoj strani. Hrana koju dodate neće se prikazivati<br>
                        u listi hrane već je dodata jednokratno kao vaš obrok.</span>
                    </v-tooltip>
                </v-col>
                <v-col cols="12" sm="11">
                    <v-expansion-panels popout class='rounded-0'>
                        <v-expansion-panel class='rounded-0'>
                            <v-expansion-panel-header>
                                <span>Namirnica se na nalazi u listi? Dodajte je.</span>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card class='rounded-0'>
                                    <v-form ref="form" v-model="valid" lazy-validation class="pa-5">
                                        <v-row>
                                            <v-col cols="12" sm="5"><v-text-field v-model="mealName" label="Naziv namirnice" :rules="[v => !!v || 'Morate uneti naziv namirnice.']" required></v-text-field></v-col>
                                            <v-col cols="12" sm="5"><v-select v-model="categorySelect" :items="categoryItems" label="Kategorija namirnice" :rules="[v => !!v || 'Morate uneti kategoriju.']"></v-select></v-col>
                                            <v-col cols="12" sm="2"><v-text-field v-model="mealWeight" suffix="g" type="number" :rules="[v => v>0 && v<9999 || 'Nepravilan unos.']"></v-text-field></v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="12" sm="2"><v-text-field type="number" v-model="mealEnergy" label="Kalorije" :rules="[v => !!v || 'Morate popuniti polje.', v => v>=0 && v<2000 || 'Nepravilan unos.']"></v-text-field></v-col>
                                            <v-col cols="12" sm="2"><v-text-field type="number" v-model="mealProteins" label="Proteini" :rules="[v => !!v || 'Morate popuniti polje.', v => v>=0 && v<999 || 'Nepravilan unos.']"></v-text-field></v-col>
                                            <v-col cols="12" sm="2"><v-text-field type="number" v-model="mealCarbs" label="Ugljeni hidrati" :rules="[v => !!v || 'Morate popuniti polje.', v => v>=0 && v<999 || 'Nepravilan unos.']"></v-text-field></v-col>
                                            <v-col cols="12" sm="2"><v-text-field type="number" v-model="mealFats" label="Masti" :rules="[v => !!v || 'Morate popuniti polje.', v => v>=0 && v<999 || 'Nepravilan unos.']"></v-text-field></v-col>
                                            <v-col cols="12" sm="4"><v-select v-model="mealSelect" :items="mealSelectItems" label="Izaberite obrok"></v-select></v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col col="12" sm="7" align="center" justify="center">
                                                <v-checkbox v-model="checkbox" :rules="[v => !!v || 'Morate se složiti da biste nastavili.']" label="Proverili ste sve unose i želite da dodate namirnicu." required></v-checkbox>
                                            </v-col>
                                            <v-col col="12" sm="5" align="center" justify="center">
                                                <v-btn color="#2A9D8F" class="mt-4 mb-4 white--text rounded-0" @click="validate"> Dodaj namirnicu </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </v-banner>
        <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
            app
            outlined
            light
            rounded="0"
            >
            {{ responseData }}
            <template v-slot:action="{ attrs }">
                <v-btn
                color="pink"
                text
                v-bind="attrs"
                @click="snackbar = false"
                class="rounded-0"
                >
                Zatvori
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'AddMeal',
    data() {
        return {
            show:false,
            timeout: 2000,
            snackbar:false,
            responseData:'',
            valid: true,
            checkbox: false,
            mealSelectItems:[
                'Doručak',
                'Ručak',
                'Užina',
                'Večera',
            ],
            mealSelect:'',
            mealEnergy:0,
            mealProteins:0,
            mealCarbs:0,
            mealFats:0,
            mealName:'',
            mealWeight: 0,
            categoryItems:[
                'voće',
                'povrće',
                'žitarice',
                'meso',
                'riba',
                'mleko',
                'slatkiši',
                'masnoće',
                'jaja',
                'piće'
            ],
            categorySelect:'',          
        };
    },
    methods: {
        validate () {
            if(this.$refs.form.validate()){
                const food = {
                    image: "image",
                    name: this.mealName,
                    weight: this.mealWeight,
                    energy: this.mealEnergy,
                    energyUnit: "kcal",
                    proteins: this.mealProteins,
                    carbs: this.mealCarbs,
                    fat: this.mealFats,
                    weightUnit: "g",
                    category: this.categorySelect
                }
                axios
                .post('/api/foodPerDay/customMeal',{ headers: { token: localStorage.getItem('token')},
                    food,
                    meal: this.mealSelect
                })
                .then( res => {
                    this.responseData = res.data;
                    this.snackbar = true;
                })
                .catch( err => {
                    console.log(err.data);
                })
            }
        },
        scrollPage(){
            this.show = false;
        }
    },
    created(){
        window.addEventListener('scroll', this.scrollPage);
    },
    destroyed() {
        window.removeEventListener('scroll', this.scrollPage);
    }
};
</script>