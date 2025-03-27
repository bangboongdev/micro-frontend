import BaseModule from '@/store/base-module';
import UtilityService from "@/services/UtilityService";

var base = new BaseModule(UtilityService);


const state = {
  ...base.state,
};
const getters = {
  ...base.getters,
};
const actions = {
  ...base.actions,
};
const mutations = {
  ...base.mutations,
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};