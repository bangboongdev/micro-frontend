import axios from "axios";
const baseUrl = "print-layout";

export default {
  saveData(data:DynamicParams) {
    return axios.post(baseUrl, data);
  },
  saveContent(data:DynamicParams) {
    return axios.post(baseUrl, data);
  },
  getItemById(id:Id) {
    return axios.get(baseUrl + `/${id}`);
  },
  getHistoryByType(type:string, id:Id) {
    return axios.get(baseUrl + `/${type}/${id}/history`);
  },
  getLayoutDefault(type:string, id:Id, version:string) {
    return axios.get(baseUrl + `/${type}/${id}/${version}`);
  },
  getFormByType(type:string) {
    return axios.get(baseUrl + `/type/${type}`);
  },
  getList() {
    return axios.get(baseUrl);
  },
  getPrintLayoutItems(type:string) {
    return axios.get("print-layout-items" + `/${type}`);
  },
  printLayout(data:DynamicParams) {
    return axios.post(baseUrl + `/print`, data);
  },
};
