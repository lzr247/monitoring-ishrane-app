<template>
    <div class="Food">
        <Navigation/>
        <v-main>
            <v-container fluid>
                <AddMeal/>
                <v-data-iterator
                :items="items"
                :items-per-page.sync="itemsPerPage"
                :page="page"
                :search="search"
                :sort-by="sortBy.toLowerCase()"
                :sort-desc="sortDesc"
                hide-default-footer
                >
                <template v-slot:header>
                    <v-toolbar
                    light
                    color="#f9f9f9"
                    class="mb-3"
                    >
                    <v-text-field
                        prepend-inner-icon="mdi-magnify"
                        v-model="search"
                        flat
                        solo-inverted
                        light
                        hide-details
                        label="Pronađi"
                        color='grey'
                        class="rounded-0"
                    ></v-text-field>
                    <template v-if="$vuetify.breakpoint.mdAndUp">
                        <v-spacer></v-spacer>
                        <v-select
                        v-model="sortBy"
                        flat
                        solo-inverted
                        hide-details
                        :items="keys"
                        prepend-inner-icon="mdi-magnify"
                        label="Sortiraj"
                        color='grey'
                        class="rounded-0"
                        ></v-select>
                        <v-spacer></v-spacer>
                        <v-btn-toggle
                        v-model="sortDesc"
                        mandatory
                        >
                        <v-btn
                            large
                            depressed
                            color="#f9f9f9"
                            :value="false"
                            class='rounded-0'
                        >
                            <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                        <v-btn
                            large
                            depressed
                            color="#f9f9f9"
                            :value="true"
                            class='rounded-0'
                        >
                            <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                        </v-btn-toggle>
                    </template>
                    </v-toolbar>
                </template>

                <template v-slot:default="props">
                    <v-row class='d-flex'>
                    <v-col
                        v-for="item in props.items"
                        :key="item.name"
                        cols="12"
                        sm="6"
                        md="4"
                        lg="3"
                        xl="2"
                        class='flex-grow-1'
                        style="max-width:100%!important"
                    >
                        <v-card class="rounded-0">
                            <v-card-title class="subheading font-weight-medium">
                                {{ item.name }}
                            </v-card-title>
                            <v-img :src="require(`../${item.image}`)" aspect-ratio="1.7"></v-img>

                            <v-divider></v-divider>

                            <v-list dense>
                                <v-list-item>
                                    <v-list-item-content :class="{ 'green--text': sortBy === 'Energy' }">
                                        Kalorije:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end" :class="{ 'green--text': sortBy === 'Energy' }">
                                        {{ item.energy }}
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content :class="{ 'green--text': sortBy === 'Proteins' }">
                                        Proteini:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end" :class="{ 'green--text': sortBy === 'Proteins' }">
                                        {{ item.proteins }} g
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content :class="{ 'green--text': sortBy === 'Carbs' }">
                                        Ugljeni Hidrati:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end" :class="{ 'green--text': sortBy === 'Carbs' }">
                                        {{ item.carbs }} g
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content :class="{ 'green--text': sortBy === 'Fat' }">
                                        Masti:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end" :class="{ 'green--text': sortBy === 'Fat' }">
                                        {{ item.fat }} g
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item>
                                    <v-list-item-content>
                                        Gramaža:
                                    </v-list-item-content>
                                    <v-list-item-content class="align-end">
                                        {{ item.weight }} g
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>

                            <v-row justify='center'>
                            <v-card-actions>
                                <v-btn @click = "openModal(item)" color="#E9C46A" class="px-3 rounded-0 black--text font-weight-regular">Dodaj</v-btn>
                            </v-card-actions>
                            </v-row>
                        </v-card>
                    </v-col>

                    <v-dialog v-model="dialog" max-width="600px" class='rounded-0'> 
                        <v-card class='rounded-0' style="overflow:hidden!important;">
                            <v-card-title>Dodavanje namirnice </v-card-title>
                            <v-divider></v-divider>
                            <v-row  class='rounded-0'>
                                <v-col cols="12" sm="4" class="text-center d-flex flex-row justify-center align-center rounded-0">
                                    <v-card-text class="text-h6"> 
                                        {{modalData.name}}
                                    </v-card-text>
                                </v-col>
                                <v-col cols="10" offset="1" sm="4" offset-sm="0" class="mt-0 mt-sm-2 rounded-circle">
                                    <v-select
                                        v-model="mealSelect"
                                        :items="mealItems"
                                        menu-props="auto"
                                        label="Obrok"
                                        hide-details
                                        prepend-icon="mdi-food"
                                        single-line
                                        :rules="[ v => !!v || 'Morate izabrati obrok.']"
                                    ></v-select>
                                </v-col>
                                <v-col cols="7" offset="2" sm="2" offset-sm="0" class="mt-0 mt-sm-2 rounded-0">
                                    <v-text-field 
                                    v-model="mealWeight" 
                                    type="number" 
                                    :rules="[v => v>0 && v<1000 || 'Nepravilan unos.']"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="3" sm="1" class="mt-7 text-start">gr</v-col>
                            </v-row>
                            
                            <v-divider></v-divider>
                            <v-card-actions class="d-flex flex-column justify-center d-sm-flex flex-sm-row justify-sm-space-around">
                                <v-btn color="#E9C46A" class="black--text rounded-0" @click="dialog = false">Nazad</v-btn>
                                <v-btn color="#E9C46A" class="black--text mt-3 mt-sm-0 rounded-0" @click="addMeal(modalData)">Dodaj obrok</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

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
                            color="#E9C46A"
                            text
                            v-bind="attrs"
                            @click="snackbar = false"
                            class="rounded-0"
                            >
                            Zatvori
                            </v-btn>
                        </template>
                    </v-snackbar>

                    </v-row>
                </template>

                <template v-slot:footer>
                    <v-row
                    class="mt-3 mb-2"
                    align="center"
                    justify="center"
                    >
                        <div class="mx-auto ml-sm-3 px-5 py-2 mt-3 rounded-0 elevation-2" style="background-color:#f9f9f9">
                            <span class="black--text ml-5">Namirnica po strani</span>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    dark
                                    text
                                    color="#2A9D8F"
                                    class="ml-2"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    {{ itemsPerPage }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                                </template>
                                <v-list>
                                <v-list-item
                                    v-for="(number, index) in itemsPerPageArray"
                                    :key="index"
                                    @click="updateItemsPerPage(number)"
                                >
                                    <v-list-item-title>{{ number }}</v-list-item-title>
                                </v-list-item>
                                </v-list>
                            </v-menu>
                        </div>
                        
                        <div class="mx-auto mr-sm-3 mt-3 px-5 py-2 rounded-0 elevation-2" style="background-color:#f9f9f9;">
                            <span
                                class="mr-4 mt-3
                                black--text"
                            >
                                Strana {{ page }} od {{ numberOfPages }}
                            </span>
                            <v-btn
                                fab
                                dark
                                color="#2A9D8F"
                                class="mr-5 mt-0"
                                @click="formerPage"
                            >
                                <v-icon color="#f9f9f9" large>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn
                                fab
                                dark
                                color="#2A9D8F"
                                class="mr-5 mt-0"
                                @click="nextPage"
                            >
                                <v-icon color="#f9f9f9" large>mdi-chevron-right</v-icon>
                            </v-btn>
                        </div>
                    </v-row>
                </template>
                </v-data-iterator>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import axios from 'axios';
import Navigation from '../components/Navigation';
import AddMeal from '../components/AddMeal';
  export default {
    name: "Food",
    components:{
        Navigation,
        AddMeal
    },
    data () {
    return {
        timeout: 2000,
        snackbar: false,
        responseData: '',
        mealSelect: '',
        mealWeight:100,
        modalData:{},
        dialog:false,
        itemsPerPageArray: [10, 12, 18],
        search: '',
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 10,
        sortBy: '',
        keys: [
        'Name',
        'Energy',
        'Fat',
        'Carbs',
        'Proteins',
        ],
        mealItems: ["Doručak","Ručak","Užina","Večera"],
        items: [],
        }
    },
    created(){
        if(localStorage.getItem('token') === null || localStorage.getItem('token') == ''){
            this.$router.push('/');
        }
    },
    computed: {
        numberOfPages () {
            return Math.ceil(this.items.length / this.itemsPerPage)
        },
    },
    mounted() {
        axios.get('/api/food', { headers: { token: localStorage.getItem('token')}})
             .then(res => {
                this.items = res.data;
                console.log(res.data);
             })
             .catch( err => {
                 console.log(err.data);
             })
    },
    methods: {
        nextPage () {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
        },
        formerPage () {
            if (this.page - 1 >= 1) this.page -= 1
        },
        updateItemsPerPage (number) {
            this.itemsPerPage = number
        },
        openModal(data){
            this.modalData = data;
            this.dialog = true;
        },
        addMeal(meal){
            if(this.mealSelect==''){
                this.snackbar = true;
                this.responseData = "Niste uneli naziv obroka."
                return;
            }
            axios.post('/api/foodPerDay',{
                    headers: {token: localStorage.getItem('token')},
                    meal: this.mealSelect,
                    food: meal,
                    weight: this.mealWeight
                })
                .then( res => {
                    this.snackbar = true;
                    this.responseData = res.data;
                })
                .catch( err => {
                    console.log(err.data);
                })
                this.dialog = false;
        }
    }
}
</script>
<style lang="scss" scoped>
    #app > div.v-dialog__content.v-dialog__content--active > div{
        background-color: red!important;
    }

    #app > div > main{
        background: #83C5BE;
        min-height: 100vh;
    }
    
    #app > div > main > div > div > div.v-data-iterator > header > div > div:nth-child(1):focus{
        background-color:white!important;
    }
</style>