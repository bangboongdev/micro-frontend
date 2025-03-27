import BaseModule from '@/store/base-module';
import DistrictService from "@/services/DistrictService";

var base = new BaseModule(DistrictService);


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