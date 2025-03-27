import EventsSevice from "@/services/EventsSevice";
import { useQuery, useQueryClient, useMutation } from "vue-query";
enum ServerStateKeysEnum {
  Items = "events",
}
export const useGetList = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await EventsSevice.get(params?.value),
    { ...config }
  )
};
export const useDetail = (params: any, config: object): any => {
  return useQuery(
    [ServerStateKeysEnum.Items,params],
    async () => await EventsSevice.detail(params?.value),
    { ...config }
  )
};
export const useSaveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => EventsSevice.save(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((data: any) => EventsSevice.delete(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.Items);
    },
  });
};
