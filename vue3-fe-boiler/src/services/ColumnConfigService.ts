import axios from "axios";
const baseUrl = "column-config";

export default {
  getColumnConfig(entity:string) {
    return axios.get(baseUrl + `/${entity}`);
  },
  saveColumnConfig(payload:DynamicParams) {
    return axios.post(baseUrl +'/save-column-config',payload);
  },
  resetColumnConfig(entity:string){
    return axios.post(baseUrl +'/reset-column-config',entity);
  }
};