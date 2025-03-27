interface State {
  data_selected: any[];
}
const state = {
  data_selected: [],
};
const getters = {
  data_selected: (state: State) => state.data_selected,
};
const actions = {};
const mutations = {
  SET_DATA_TABLE(state: State, data: any) {
    state.data_selected = data;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
