import axios from "axios";
const baseUrl = "report";

export default {
  get(payload:DynamicParams) {
    return axios.get(
      baseUrl +
        `/report-info?type=${payload.type}&report_category=${payload.category}`
    );
  },
  getReportData(payload:DynamicParams) {
    return axios.post(baseUrl + `/report-data`, payload);
  },
  saveColumnConfigs(payload:DynamicParams){
    return axios.post(baseUrl +'/save-column-config',payload)
  },
  resetColumnConfigs(payload:DynamicParams){
    return axios.post(baseUrl +'/reset-column-config',payload)
  },
  export(payload:DynamicParams) {
    return axios.post(baseUrl + `/export-data`, payload , {
      responseType: "blob"})
  },
  print(payload:DynamicParams) {
    return axios.post(baseUrl + `/print`, payload);
  },
};
