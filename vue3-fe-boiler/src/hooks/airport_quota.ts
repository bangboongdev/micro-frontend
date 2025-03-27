import AirportQuotaService from "@/services/AirportQuotaService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "airport_quota",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await AirportQuotaService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await AirportQuotaService.detail(params?.value),
    { ...config }
  );
};
