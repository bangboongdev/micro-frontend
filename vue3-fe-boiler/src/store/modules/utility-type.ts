import BaseModule from '@/store/base-module';
import UtilityTypeService from "@/services/UtilityTypeService";

var base = new BaseModule(UtilityTypeService);


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