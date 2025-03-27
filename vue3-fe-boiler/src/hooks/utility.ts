import UtilityService from "@/services/UtilityService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "utility",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await UtilityService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await UtilityService.detail(params?.value),
    { ...config }
  )
};