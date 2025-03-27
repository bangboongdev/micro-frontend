import CompanyService from "@/services/CompanyService"
import { useQuery,useQueryClient,useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "company",
}
export const useGetList = (params: any, config: object): any => {
    return useQuery(
      [ServerStateKeysEnum.Items,params],
      async () => await CompanyService.get(params?.value),
      { ...config }
    )

};
export const useDetail = (params: any, config: object): any => {
  debugger 
  console.log(ServerStateKeysEnum.Items,params)
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await CompanyService.detail(params?.value),
    { ...config }
  )
};