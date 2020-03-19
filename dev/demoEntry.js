import Vue from 'vue'
import vuetify from './src/vuetify'
import hawesomeVue from '../src/plugin'
import Demo from './Demo'
import store from "./src/store";

var notifySetting = { position: "bottomRight" };
var dialogSetting = {};
var loaderSetting = { type: "linear" };

Vue.use(hawesomeVue, { store, notifySetting, dialogSetting, loaderSetting })

new Vue({
    store,
    vuetify,
    render: h => h(Demo)
}).$mount('#app')
