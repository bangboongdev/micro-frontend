import axios from "axios";
interface Reset{
  token:string,
  email:string,
  password:string,
  password_confirmation:string
}
export default {
  changePassword(params:DynamicParams) {
    return axios.post("user/change-password", params);
  },
  resetPassword(email:string) {
    return axios.post("reset-password", { email });
  },
  reset({ token, email, password, password_confirmation }:Reset) {
    return axios.post("reset-password/reset", {
      token,
      email,
      password,
      password_confirmation,
    });
  },
};
