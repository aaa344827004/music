import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // playlist:''
    vol:Number
  },
  mutations: {
    // changeUrl(state, list){
    //   state.playlist = list
    // }
    changeVol(state,payLoad){
      state.vol = payLoad
    }
  },
  actions: {
  },
  modules: {
  }
})
