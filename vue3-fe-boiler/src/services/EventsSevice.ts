import axios from "axios";
const baseUrl = "events";

export default {
  get(params: DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id: Id) {
    return axios.get(baseUrl + `/${id}`);
  },
  delete(id: Id) {
    return axios.delete(baseUrl + `/${id}`);
  },
  save(data:DynamicParams) {
    debugger
    console.log(data);
    return axios.post(baseUrl, data);
  },
};