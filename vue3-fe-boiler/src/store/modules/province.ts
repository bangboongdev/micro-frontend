import BaseModule from '@/store/base-module';
import ProvinceService from "@/services/ProvinceService";

var base = new BaseModule(ProvinceService);


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