import Vue from 'vue'
import Vuex from 'vuex'

import team from './team'
import hero from  './hero'
import org from "./orgs";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    team,
    hero,
    org
  }
})