import BaseModule from '@/store/base-module';
import PaymentTypeService from "@/services/PaymentTypeService";

var base = new BaseModule(PaymentTypeService);


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