import DistrictDistanceQuotaService from "@/services/DistrictDistanceQuotaService";
import { useQuery, useQueryClient, useMutation } from "vue-query";
import FileService from "@/services/FileService";
enum ServerStateKeysEnum {
  Items = "district_distance_quota",
  UpdateDistance = "update_distance",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await DistrictDistanceQuotaService.get(params?.value),
    { ...config }
  );
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items, params],
    async () => await DistrictDistanceQuotaService.detail(params?.value),
    { ...config }
  );
};
export const useUploadDistance = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data: any) => DistrictDistanceQuotaService.uploadDistance(data),
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(ServerStateKeysEnum.Items);
      },
    }
  );
};
