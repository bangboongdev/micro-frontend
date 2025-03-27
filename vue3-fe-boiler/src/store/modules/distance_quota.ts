import BaseModule from '@/store/base-module';
import DistanceQuotaService from "@/services/DistanceQuotaService";

var base = new BaseModule(DistanceQuotaService);


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