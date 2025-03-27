import * as _ from "lodash";
import ColumnConfigService from "@/services/ColumnConfigService";

interface State {
  [key: string]: any;
}
interface Getters {
  [key: string]: any;
}
interface Action {
  [key: string]: any;
}
interface Mutations {
  [key: string]: any;
}

interface Columns {
  dataIndex: string;
  ellipsis?: string;
  fixed?: string;
  isCodeIndex?: boolean;
  isNameIndex?: boolean;
  key?: string;
  title: string;
  width: string;
  dataType: string;
}
interface Filter{
  columns:string[],
  filters?:any,
  pageIndex:number,
  pageSize:number,
}
interface SelectedColumn {
  [key:string]:any
}
interface Result{
  columns:Columns[],
  selectedColumns:SelectedColumn[]
}
class BaseModule {
  state: State;
  getters: Getters;
  actions: Action;
  mutations: Mutations;
  constructor(service: any) {
    this.state = {
      service: service,
      items: [],
      total: 0,
      loading: false,
      item: {},
      maxHeight: 1,
      importLoading: false,
      importObject: {
        header: {},
        data: [],
      },
      filter:{},
      importTotal: 0,
      columnConfigs: [],
      loginObj: {},
    };
    this.getters = {
      customColumnConfigs: (state:State) => {
        let data = state.columnConfigs;
        data.forEach((element:any) => {
          element.is_checked = element.visible;
        });
        let result = data;
        return result;
      },
      defaultColumns: (state:State) => {
        let data = state.columnConfigs;
        let result:Result = {
          columns: [],
          selectedColumns: [],
        };
        // let cols = [];
        let columns: Columns[] = [];
        data?.forEach((element:any) => {
          if (element.visible == 1) {
            if (element.data_field == "code") {
              columns.push({
                dataIndex: element.data_field,
                ellipsis: element.ellipsis,
                fixed: "left",
                isCodeIndex: true,
                isNameIndex: true,
                key: element.data_field,
                title: element.title,
                width: element.width,
                dataType: element.data_type,
              });
            }
            if (element.data_field == "status") {
              columns.push({
                dataIndex: element.data_field,
                dataType: element.data_type,
                title: element.title,
                width: element.width,
              });
            }
            if (
              element.data_field !== "status" &&
              element.data_field !== "code"
            ) {
              columns.push({
                dataIndex: element.data_field,
                dataType: element.data_type,
                title: element.title,
                width: element.width,
              });
            }
          }
        });
        data?.forEach((p:any) => {
          if (p.user_id == null) {
            result.selectedColumns.push(p.data_field);
          }
        });
        result.columns = columns;
        return result;
      },
      service: (state:State) => state.service,
      importTotal: (state:State) => state.importObject.data.length,
      validImportTotal: (state:State) =>
        state.importObject.data.filter((p:any) => p.importable).length,
      invalidImportTotal: (state:State) =>
        state.importObject.data.filter((p:any) => !p.importable).length,
    };
    this.actions = {
      getItems({ state, commit }:any, params:DynamicParams) {
        setTimeout(() => {
          commit("SET_LOADING", true);
        }, 0);
        return state.service.get(params).then((response:any) => {
          if (response.data.errorCode == 0) {
            let result = response.data.data;
            commit("SET_ITEMS", result);
            commit("SET_LOADING", false);
            commit("SET_HEIGHT", result.items);
          }
        });
      },
      getItem({ state, commit }:any, id:Id) {
        return state.service.detail(id).then((response:any) => {
          if (response.data.errorCode == 0) {
            let result = response.data.data;
            commit("SET_ITEM", result);
          }
        });
      },
      setLoading({ state, commit }:any, loading:boolean) {
        commit("SET_LOADING", loading);
      },
      setImportLoading({ state, commit }:any, loading:boolean) {
        commit("SET_IMPORT_LOADING", loading);
      },
      validateImport({ state, commit }:any, payload:any) {
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("action", payload.action);
        commit("SET_IMPORT_LOADING", true);
        return new Promise((resolve, reject) => {
          state.service.validateImport(formData).then(
            (response:any) => {
              commit("SET_IMPORT_OBJECT", response.data.data);
              commit("SET_IMPORT_LOADING", false);
              resolve(response);
            },
            (error:any) => {
              commit("SET_IMPORT_LOADING", true);
              reject(error);
            }
          );
        });
      },
      import({ state, commit }:any, payload:any) {
        commit("SET_IMPORT_LOADING", true);
        return new Promise((resolve, reject) => {
          state.service.import(payload).then(
            (response:any) => {
              commit("SET_IMPORT_LOADING", false);
              resolve(response);
            },
            (error:any) => {
              commit("SET_IMPORT_LOADING", true);
              reject(error);
            }
          );
        });
      },
      export({ state, commit }:any, payload:any) {
        return new Promise((resolve, reject) => {
          state.service.export(payload).then(
            (response:any) => {
              resolve(response);
            },
            (error:any) => {
              reject(error);
            }
          );
        });
      },
       getColumnConfig({ commit }:any, payload:any) {
        return new Promise((resolve, reject) => {
          const columns = localStorage.getItem(`column-${payload}`);
          if (columns != null) {
            commit("SET_COLUMN_CONFIG_DATA", JSON.parse(columns));
            commit("SET_LOADING", false);
            resolve(columns);
          } else {
            ColumnConfigService.getColumnConfig(payload).then(
              (response) => {
                let result = response.data.data;
                localStorage.setItem(
                  `column-${payload}`,
                  JSON.stringify(result)
                );
                commit("SET_COLUMN_CONFIG_DATA", result);
                commit("SET_LOADING", false);
                resolve(response);
              },
              (error) => {
                reject(error);
              }
            );
          }
        });
      },
      saveColumnConfig({ commit }:any, payload:any) {
        commit("SET_LOADING", true);
        return new Promise((resolve, reject) => {
          ColumnConfigService.saveColumnConfig(payload).then(
            (response) => {
              commit("SET_LOADING", false);
              resolve(response);
            },
            (error) => {
              reject(error);
            }
          );
        });
      },
      resetColumnConfig({ commit }:any, payload:any) {
        commit("SET_LOADING", true);
        return new Promise((resolve, reject) => {
          const defaultColumnConfigs = localStorage.getItem(
            `default-column-${payload.entity}`
          );
          if (defaultColumnConfigs != null) {
            commit("SET_LOADING", false);
            commit("SET_COLUMN_CONFIG_DATA", JSON.parse(defaultColumnConfigs));
            localStorage.setItem(
              `column-${payload.entity}`,
              defaultColumnConfigs
            );
            resolve(defaultColumnConfigs);
          } else {
            ColumnConfigService.resetColumnConfig(payload).then(
              (response) => {
                let result = response.data.data;
                localStorage.setItem(
                  `default-column-${payload.entity}`,
                  JSON.stringify(result)
                );
                localStorage.setItem(
                  `column-${payload.entity}`,
                  JSON.stringify(result)
                );
                commit("SET_COLUMN_CONFIG_DATA", result);
                commit("SET_LOADING", false);
                resolve(response);
              },
              (error) => {
                reject(error);
              }
            );
          }
        });
      },
    };
    this.mutations = {
      Get_Login_Obj( state:State , data: any) {
        state.loginObj = data;
      },
      SET_HEIGHT(state:State, data:any) {
        if (data.length == 0) {
          state.maxHeight = 1;
        } else {
          if (state.maxHeight == 1) {
            state.maxHeight = window.innerHeight - 300;
          }
        }
      },
      SET_LOADING(state:State, loading:boolean) {
        state.loading = loading;
      },
      SET_ITEMS(state:State, result:any) {
        if (result == null) {
          state.items = [];
          state.total = 0;
        } else {
          state.items = result.items;
          state.total = result.totalCount;
        }
      },
      SET_ITEM(state:State, result:any) {
        state.detail = result;
      },
      SET_IMPORT_LOADING(state:State, loading:boolean) {
        state.importLoading = loading;
      },
      SET_IMPORT_OBJECT(state:State, result:any) {
        state.importObject = result;
      },
      SET_COLUMN_CONFIG_DATA(state:State, columnConfigs:Columns) {
        state.columnConfigs = columnConfigs;
      },
      SET_FILTER(state:State,result:Filter){
        state.filter = result;
      }
    };
  }
}
export default BaseModule;
