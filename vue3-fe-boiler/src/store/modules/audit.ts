import BaseModule from '@/store/base-module';
import AuditService from "@/services/AuditService";

var base = new BaseModule(AuditService);


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
