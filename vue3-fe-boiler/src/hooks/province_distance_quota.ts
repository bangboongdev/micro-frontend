import ProvinceDistanceQuotaService from "@/services/ProvinceDistanceQuotaService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "province_distance_quota",
  UpdateDistance = "update_distance",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await ProvinceDistanceQuotaService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await ProvinceDistanceQuotaService.detail(params?.value),
    { ...config }
  );
};
export const useUploadDistance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: any) => ProvinceDistanceQuotaService.uploadDistance(data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      },
    }
  );
};
