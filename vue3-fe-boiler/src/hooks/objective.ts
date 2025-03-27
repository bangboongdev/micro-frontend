import ObjectiveService from "@/services/ObjectiveService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "objective",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ObjectiveService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await ObjectiveService.detail(params?.value),
    { ...config }
  )
};