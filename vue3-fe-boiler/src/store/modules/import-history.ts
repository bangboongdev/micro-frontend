import BaseModule from '@/store/base-module';
import ImportHistoryService from "@/services/ImportHistoryService";

var base = new BaseModule(ImportHistoryService);


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
