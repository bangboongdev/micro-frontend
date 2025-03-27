import BaseModule from '@/store/base-module';
import RoleService from "@/services/RoleService";

var base = new BaseModule(RoleService);


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
