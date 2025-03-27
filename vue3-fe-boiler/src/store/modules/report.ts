import { ActionTree, MutationTree, GetterTree } from "vuex";
import { result } from "lodash";
import ReportService from "@/services/ReportService";
interface ReportObject {
  report_info: any;
  report_params?: any;
  column_configs: any[];
}
interface State {
  reportObject: ReportObject;
  reportData: any[];
  reportSummary: any;
  is_pagination: boolean;
  reportLoading: boolean;
  loading: boolean;
}
const state = (): State => ({
  reportObject: {
    report_info: {},
    column_configs: [],
  },
  reportData: [],
  reportSummary: [],
  is_pagination: true,
  loading: false,
  reportLoading: false,
});

const getters: GetterTree<State, any> = {
  columnConfigs: (state) => {
    let column = state.reportObject?.column_configs;
    column.forEach((element) => {
      element.is_checked = element.visible;
    });
    let result = column ? Object.values(column) : [];
    return result;
  },
  totalCount: (state) => {
    
    let result = state.reportSummary?.total_count;
    return result;
  },
  dynamicColumn: (state: any) => {
    let columns: any = state.reportObject?.column_configs;
    let dynamic: any = [];
    let dynamicData: any = [];
    let totalChildDynamic: any = [];
    let nameChildDynamic: any = [];
    let totalChildSystem: any = [];
    let parentGroupName: any = [];
    let nameChildSystem: any = [];
    let recordColumns: any = [];
    let childDynamic: any = [];
    let childSystem: any = [];
    let result = {
      column: {},
      childDynamic: {},
      childDynamicCol: {},
      systemCol: {},
      childSystem: {},
      colspanTotal: 0,
      totalCol: 0,
    };
    columns?.forEach(function (element: any) {
      if (element.dynamic_data !== null && element.visible == 1) {
        dynamic.push(element.dynamic_data);
        totalChildDynamic.push(element.title);
      }
      if (
        element.dynamic_data == null &&
        element.parent_group_name == null &&
        element.visible == 1
      ) {
        recordColumns.push({
          name: element.title,
          colspan: 1,
          rowspan: 2,
          width: 160,
          group: [],
        });
        result.colspanTotal += 1;
      }
      if (
        element.dynamic_data == null &&
        element.parent_group_name !== null &&
        element.visible == 1
      ) {
        totalChildSystem.push(element.title);
        parentGroupName.push({
          name: element.title,
          parentGroupName: element.parent_group_name,
        });
      }
    });
    let dynamicCol = [...new Set(dynamic)];
    nameChildDynamic = [...new Set(totalChildDynamic)];
    nameChildSystem = [...new Set(totalChildSystem)];
    nameChildDynamic.forEach(function (element: any) {
      childDynamic.push({ name: element, width: 160 });
    });
    result.childDynamic = childDynamic;

    nameChildSystem.forEach(function (element: any) {
      childSystem.push({ name: element, width: 160 });
    });
    result.childSystem = childSystem;

    dynamicCol.forEach(function (element: any) {
      state.reportObject?.dynamic_data[element].forEach(function (
        element: any
      ) {
        dynamicData.push(element);
      });
    });
    result.childDynamicCol = dynamicData;
    dynamicData.forEach(function (element: any) {
      recordColumns.push({
        name: element.name,
        colspan: nameChildDynamic.length,
        rowspan: 1,
        width: 160,
        group: [],
      });
    });
    let groupName: any = [];
    columns?.forEach(function (element: any) {
      if (
        element.dynamic_data == null &&
        element.parent_group_name !== null &&
        element.visible == 1
      ) {
        groupName.push(element.parent_group_name);
      }
    });
   
    let parentGroup = [...new Set(groupName)];
    result.systemCol = parentGroup;
    parentGroup?.forEach(function (element) {
      recordColumns.push({
        name: element,
        colspan: nameChildSystem.length,
        rowspan: 1,
        width: 160,
        group: [],
      });
    });
    recordColumns?.forEach(function (record: any) {
      parentGroupName.forEach(function (parent: any) {
        if (record.name == parent.parentGroupName) {
          record.group.push(parent.name);
        }
      });
    });
    recordColumns.forEach(function (element: any) {
      result.totalCol += element.colspan;
    }),
      (result.column = recordColumns);
    return result;
  },
  paramValue: (state) => {
    let data = state.reportObject?.report_params;
    let result: any = {};
    data?.forEach(function (element: any) {
      result[element.param_field] = "";
    });
    return result;
  },
  hasSummaryData(state) {
    return state.reportObject?.report_info?.has_summary_data;
  },
  is_pagination: (state) => {
    let result = state.reportObject?.report_info?.is_pagination;
    return result || true;
  },
};
const actions: ActionTree<State, any> = {
  getItem({ commit }, payload) {
    commit("SET_LOADING", true);
    return new Promise((resolve, reject) => {
      ReportService.get(payload).then(
        (response) => {
          commit("SET_REPORT", response.data.data);
          commit("SET_LOADING", false);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  getReportData({ commit }, payload) {
    commit("SET_REPORT_LOADING", true);
    return new Promise((resolve, reject) => {
      ReportService.getReportData(payload).then(
        (response) => {
          commit("SET_REPORT_DATA", response.data.data);
          commit("SET_REPORT_SUMMARY", response.data.summary);
          commit("SET_REPORT_LOADING", false);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  saveColumnConfigs({ commit }, payload) {
    commit("SET_REPORT_LOADING", true);
    return new Promise((resolve, reject) => {
      ReportService.saveColumnConfigs(payload).then(
        (response) => {
          commit("SET_REPORT_LOADING", false);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  exportExcel({ commit }, payload) {
    commit("SET_REPORT_LOADING", true);
    return new Promise((resolve, reject) => {
      ReportService.export(payload).then(
        (response) => {
          commit("SET_REPORT_LOADING", false);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  resetColumnConfigs({ commit }, payload) {
    commit("SET_REPORT_LOADING", true);
    return new Promise((resolve, reject) => {
      ReportService.resetColumnConfigs(payload).then(
        (response) => {
          commit("SET_REPORT_LOADING", false);
          commit("RESET_COLUMN_CONFIGS", response.data.data);
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
};
const mutations: MutationTree<State> = {
  SET_REPORT(state, result) {
    state.reportObject = result;
  },
  SET_REPORT_DATA(state, result) {
    state.reportData = result;
  },
  SET_REPORT_SUMMARY(state, result) {
    state.reportSummary = result;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_REPORT_LOADING(state, loading) {
    state.reportLoading = loading;
  },
  RESET_COLUMN_CONFIGS(state, result) {
    state.reportObject.column_configs = result;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
