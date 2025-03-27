import axios from "axios";
const baseUrl = "role";

export default {
  get(params:DynamicParams) {
    return axios.get(baseUrl, {
      params: params,
    });
  },
  detail(id:Id) {
    return axios.get(baseUrl + `/${id}`);
  },
  save(data:DynamicParams) {
    return axios.post(baseUrl, data);
  },
  getPermission() {
    return axios.get("/permission");
  },
};
