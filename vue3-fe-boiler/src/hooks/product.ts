import ProductService from "@/services/ProductService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "product",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ProductService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  debugger
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ProductService.detail(params?.value),
    { ...config }
  )
};