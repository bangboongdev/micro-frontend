import axios from "axios";
const baseUrl = "notification";

export default {
  list(pageIndex:number, unread:boolean) {
    return axios.get(baseUrl + `/list`, {
      params: {
        pageIndex,
        isViewUnRead: unread,
      },
    });
  },
  all(pageIndex:number) {
    return axios.post(baseUrl + `/list?pageIndex=${pageIndex}`);
  },
  getReadList() {
    return axios.get(baseUrl + `/read`);
  },
  postRead() {
    return axios.post(baseUrl + `/read`);
  },
  saveItem(id:Id) {
    return axios.post(baseUrl + `/save`, {
      id: id,
    });
  },
  updateFcm(token:string) {
    return axios.post(`fcm-token`, {
      token,
    });
  },
};
