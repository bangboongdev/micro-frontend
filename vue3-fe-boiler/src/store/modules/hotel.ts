import BaseModule from '@/store/base-module';
import HotelService from "@/services/HotelService";

var base = new BaseModule(HotelService);


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