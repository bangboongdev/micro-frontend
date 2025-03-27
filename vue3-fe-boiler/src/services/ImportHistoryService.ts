import axios from "axios";
const baseUrl = "import-history";
interface Params{
    [key:string]: any
}
export default {
    get(params:Params) {
        return axios.get(baseUrl, {
            params: params,
        });
    },
    detail(id:number |string) {
        return axios.get(baseUrl + `/${id}`);
    },
    downloadFile(id:number |string) {
        return axios.get('file' + `/${id}`);
    },
};