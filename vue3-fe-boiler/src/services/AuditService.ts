import axios from "axios";
const baseUrl = "audit";

export default {
  get(params:DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id:Id) {
    return axios.get(baseUrl + `/${id}`);
  },
};
