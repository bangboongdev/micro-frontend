import BaseModule from '@/store/base-module';
import PartnerService from "@/services/PartnerService";

var base = new BaseModule(PartnerService);


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