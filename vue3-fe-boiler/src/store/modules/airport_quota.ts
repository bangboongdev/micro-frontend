import BaseModule from '@/store/base-module';
import AirportQuotaService from "@/services/AirportQuotaService";

var base = new BaseModule(AirportQuotaService);


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