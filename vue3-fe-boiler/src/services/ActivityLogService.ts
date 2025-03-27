import axios from "axios";
const baseUrl = "activity-log";

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