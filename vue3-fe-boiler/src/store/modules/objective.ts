import BaseModule from '@/store/base-module';
import ObjectiveService from "@/services/ObjectiveService";

var base = new BaseModule(ObjectiveService);


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