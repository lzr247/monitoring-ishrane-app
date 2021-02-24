<template>
    <div class="Diagram">
        <Navigation/>
        <v-main>
            <v-card class="mx-auto mt-5 pa-3">
                <v-card-text class="text-h5">
                    Vaša kilaža po datumima:
                </v-card-text>
                <div id="chart">
                    <apexchart ref="realTimeChart" type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
                </div>
            </v-card>

            <v-card class="mx-auto mt-5 d-flex flex-column justify-space-between align-center py-5 flex-sm-row justify-sm-space-around align-sm-center">
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field type="number" v-model="weight" label="Unesite svoju težinu" :rules="[v => !!v || 'Morate uneti težinu.', v => v>0 && v<250 || 'Nepravilan unos.']"></v-text-field>
                    <v-btn color="#E9C46A" class="white--text" @click="validate">Ažuriraj težinu</v-btn>
                </v-form>
                <div class="mt-5 mt-sm-0 text-center text-sm-left">
                    <span >
                        Vaša trenutna težina: {{this.currentWeight}}kg<br>
                        Vaša početna težina: {{this.startWeight}}kg<br>
                        Vaš cilj: {{this.goal}} za {{this.lostGainKg}}kg
                    </span>
                </div>
            </v-card>

            <v-card class="mx-auto my-5 ">
                <v-card-text class="text-h5">
                    Istorija unosa nutrijenata:
                </v-card-text>
                <v-expansion-panels>
                    <v-expansion-panel v-for="(item,index) in historyArray" :key="index">
                        <v-expansion-panel-header>{{item.date}}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <p>Datuma {{item.date}} uneli ste:</p>
                            Kalorija: {{item.todayCalsIntake}}
                            <v-progress-linear color="light-blue" height="30" :value="item.todayCalsIntake/maxIntakeCals*100" striped></v-progress-linear>
                            Proteina: {{item.todayProteinsIntake}}
                            <v-progress-linear color="light-blue" height="30" :value="item.todayProteinsIntake/maxIntakeProteins*100" striped></v-progress-linear>
                            Ugljenih Hidrata: {{item.todayCarbsIntake}}
                            <v-progress-linear color="light-blue" height="30" :value="item.todayCarbsIntake/maxIntakeCarbs*100" striped></v-progress-linear>
                            Masti: {{item.todayFatsIntake}}
                            <v-progress-linear color="light-blue" height="30" :value="item.todayFatsIntake/maxIntakeFats*100" striped></v-progress-linear>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-card>

        </v-main>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import Navigation from '../components/Navigation';
import axios from 'axios';
export default {
    name: 'Data',
    components:{
        Navigation,
        apexchart: VueApexCharts
    },
    data() {
        return {
            maxIntakeCals: 0,
            maxIntakeCarbs: 0,
            maxIntakeProteins: 0,
            maxIntakeFats: 0,
            historyArray:[],
            startWeight: null,
            currentWeight: null,
            valid: false,
            weight: 0,
            lostGainKg: 0,
            goal: '',
            series: [
                {
                    name: 'Težina',
                    data: []
                }
            ],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'bar',
                },
                colors: ['#41B883'],
                plotOptions: {
                    bar: {
                        dataLabels: {
                            position: 'top', 
                        },
                        distributed: true
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val + "kg";
                    },
                    offsetY: -20,
                    style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                    }
                },
                xaxis: {
                    categories: [],
                    position: 'top',
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    },
                    crosshairs: {
                        fill: {
                        type: 'gradient',
                        gradient: {
                                colorFrom: '#D8E3F0',
                                colorTo: '#BED1E6',
                                stops: [0, 100],
                                opacityFrom: 0.4,
                                opacityTo: 0.5,
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                    }
                },
                yaxis: {
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false,
                    },
                    labels: {
                        show: false,
                        formatter: function (val) {
                        return val + "kg";
                        }
                    }
                }
            },
        };
    },
    created(){
        if(localStorage.getItem('token') === null || localStorage.getItem('token') == ''){
            this.$router.push('/');
        }
    },
    mounted() {
        axios.get('/api/progress', { headers: { token: localStorage.getItem('token')}})
            .then( res => {
                this.startWeight = res.data[0].weight;
                this.currentWeight = res.data[res.data.length-1].weight;
                for(let i = 0; i<res.data.length; i++){
                    this.series[0].data.push(res.data[i].weight);
                    this.chartOptions.xaxis.categories.push(res.data[i].date)
                }
            })
            .catch( err => {
                console.log(err.data);
            })
        axios.get('/api/users/me', { headers: {token: localStorage.getItem('token')}})
            .then(res => {
                this.goal = res.data.goal;
                this.lostGainKg = res.data.lostGainKg;
                this.maxIntakeCals = res.data.maxIntakeCals;
                this.maxIntakeCarbs = res.data.maxIntakeCarbs;
                this.maxIntakeProteins = res.data.maxIntakeProteins;
                this.maxIntakeFats = res.data.maxIntakeFats;
            })
            .catch( err => {
                 console.log(err.data);
             })
        axios.get('/api/todaysIntakes/all', {headers: { token: localStorage.getItem('token')}})
            .then( res => {
                this.historyArray = res.data.reverse();
            })
            .catch( err => {
                 console.log(err.data);
            })
    },
    methods: {
        validate(){
            if(this.$refs.form.validate()){
                axios.post('/api/progress', 
                        { headers: { token: localStorage.getItem('token')}, 
                        data:{
                            weight: this.weight
                        }
                        })
                    .then( res => {
                        this.startWeight = res.data[0].weight;
                        this.currentWeight = res.data[res.data.length-1].weight;
                        let weightArray = [];
                        let dateArray = [];
                        for(let i = 0; i<res.data.length; i++){
                            weightArray.push(res.data[i].weight);
                            dateArray.push(res.data[i].date)
                        }
                        this.series = [{ data: []}]
                        this.series[0].data = weightArray;
                        this.chartOptions.xaxis.categories = dateArray;
                    })
                    .catch( err => {
                        console.log(err.data);
                    })
            }
        }
    },
};
</script>

<style lang="scss" scoped>
    #app > div > main{
        background: #83C5BE;
        min-height: 100vh;
    }
    #app > div > main > div > div{
        max-width: 80%;
    }
</style>