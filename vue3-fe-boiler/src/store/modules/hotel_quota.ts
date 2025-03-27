import BaseModule from '@/store/base-module';
import HotelQuotaService from "@/services/HotelQuotaService";

var base = new BaseModule(HotelQuotaService);


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