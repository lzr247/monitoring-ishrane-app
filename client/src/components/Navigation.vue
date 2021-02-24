<template>
    <div class='Navigation'>

        <v-app-bar flat app dark>
            <v-app-bar-nav-icon @click='drawer = !drawer'></v-app-bar-nav-icon>
            <v-app-bar-title class="text-uppercase">
                <span class="font-weight-thin" style="font-size:20px;">Ishrana</span>
                <br v-if="titleBreak"/>
                <span class="font-weight-bold" style="font-size:20px;"> I Zdravlje</span>    
            </v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn @click="logout" text color='#fff'>
                <span>Odjava</span>
                <v-icon right>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>

        <v-navigation-drawer v-model='drawer' app>
            <v-layout column align-center>
                <v-flex class='mt-5'>
                    <v-avatar size='80'>                 
                        <v-avatar color="white" size="56">
                            <span class="headline">
                                <v-icon large color="#2A9D8F">mdi-account</v-icon>
                            </span>
                        </v-avatar>
                    </v-avatar>
                </v-flex>
            </v-layout>
            <v-list>
                <v-list-item v-for="link in links" :key="link.title" :to="link.route">
                    <v-list-item-action>
                        <v-icon color="white" large>{{link.icon}}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title class="white--text">{{link.title}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div> 
</template>

<script>
export default {
    name: 'Navigation',
    data() {
        return {
            titleBreak: false,
            drawer: null,
            navIconShow:true,
            links: [
                { icon: 'mdi-view-dashboard', title:'Moj Plan', route:'/dashboard' },
                { icon: 'mdi-food', title:'Lista Hrane', route:'/foodList' },
                { icon: 'mdi-chart-bar', title:'Dijagrami', route:'/diagrams' },
                { icon: 'mdi-account', title:'Moji Podaci', route:'/data' }
            ],
            items:[],
        };
    },
    created(){
        window.addEventListener('resize', this.myEventHandler);
    },
    destroyed() {
        window.removeEventListener('resize', this.myEventHandler);
    },
    methods: {
        myEventHandler(){
            if(document.body.clientWidth <= 450){
                this.titleBreak = true;
            }else{
                this.titleBreak = false;
            }
        },
        logout(){
            localStorage.clear();
            this.$router.push('/');
        }
    },
};
</script>
<style lang="scss" scoped>
    header{
        background-color: #2A9D8F!important;
    }
    nav{
        background-color: #2A9D8F!important;
    }
    @media screen and(max-width:450px){
        header > div > div > div > span{
            font-size: 18px!important;
        }
        #app > div > div > header > div > div.text-uppercase.v-toolbar__title.v-app-bar-title{
        max-width:200px!important;
    }
    }
    #app > div > div > header > div > div.text-uppercase.v-toolbar__title.v-app-bar-title{
        max-width:400px!important;
    }
</style>