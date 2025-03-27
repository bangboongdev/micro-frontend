import AnswerService from "@/services/AnswerService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "answer",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await AnswerService.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await AnswerService.detail(params?.value),
    { ...config }
  )
};