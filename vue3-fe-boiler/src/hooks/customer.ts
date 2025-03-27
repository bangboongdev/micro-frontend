import CustomerService from "@/services/CustomerService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "customer",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CustomerService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CustomerService.detail(params?.value),
    { ...config }
  )
};
export const useGetItemByIdentify = (params: any, config: object): any => {
  console.log(params)
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CustomerService.getItemByIdentify(params?.value?.identify_no,params?.value?.type),
    { ...config }
  )
};