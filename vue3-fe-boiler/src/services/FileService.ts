import axios from "axios";
export default {
  upload(file:string) {
    const fmData = new FormData();
    fmData.append("file", file);
    return axios.post("file", fmData);
  },
  uploadImg(file:any){
    const fmData = new FormData();
    fmData.append("file", file);
    return axios.post("file", fmData);
  }
 
};
