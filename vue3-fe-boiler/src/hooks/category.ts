import CategoryService from "@/services/CategoryService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "category",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CategoryService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CategoryService.detail(params?.value),
    { ...config }
  )
};