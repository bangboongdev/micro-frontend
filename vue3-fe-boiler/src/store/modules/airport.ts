import BaseModule from '@/store/base-module';
import AirportService from "@/services/AirportService";

var base = new BaseModule(AirportService);


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