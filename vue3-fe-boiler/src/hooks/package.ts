import PackageService from "@/services/PackageService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "package",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await PackageService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await PackageService.detail(params?.value),
    { ...config }
  )
};