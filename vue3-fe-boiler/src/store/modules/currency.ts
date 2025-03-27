import BaseModule from '@/store/base-module';
import CurrencyService from "@/services/CurrencyService";

var base = new BaseModule(CurrencyService);


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