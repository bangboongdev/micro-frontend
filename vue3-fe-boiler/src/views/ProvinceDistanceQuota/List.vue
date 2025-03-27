<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Khoảng cách các tỉnh"
  >
    <template v-slot:backIcon>
      <ArrowLeftOutlined v-if="isShowBack" @click="() => $router.go(-1)" />
      <template v-else />
    </template>
  </a-page-header>
  <span>
    <table v-if="!isLoading">
      <thead>
        <tr>
          <th></th>
          <th v-for="item in columns" :key="item.id">
            {{ item.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in rows" :key="item.id">
          <th class="title_column">{{ item.title }}</th>
          <td
            v-for="(data, index) in item.items"
            :key="props"
            @click="showModal(index, item.title, data)"
          >
            {{ formatNumber(data.value) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div class="loading">
      <a-spin :spinning="isLoading"></a-spin>
    </div>
  </span>
  <a-modal
    v-model:visible="visible"
    :title="`${to_province_index} - ${from_province_index}`"
    @ok="handleOk"
    okText="Lưu"
    cancelText="Hủy"
  >
    <a-input v-model:value="change_distance" placeholder="Nhập khoảng cách" />
  </a-modal>
</template>

<script setup lang="ts">
import { useGetList, useUploadDistance } from "@/hooks/province_distance_quota";
import { formatNumber } from "@/utility";
import { ref, computed, watch, onMounted } from "vue";
import i18n from "@/lang";
import { message } from "ant-design-vue";
import * as _ from "lodash";
const { t } = i18n.global;
const itemId = ref<any>();
const isShowModal = ref<boolean>(false);
const visible = ref<boolean>(false);

const from_province_index = ref<any>();
const to_province_index = ref<any>();
const index_province = ref<any>();
const id_distance_index = ref<number>();
const change_distance = ref<string>();
interface Props {
  isShowBack: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  isShowBack: true,
});
const params = {
  value: { pageSize: 4000 },
};

const items = ref([]);
const columns = ref([]);
const rows = ref([]);

const useUploadDistanceData = useUploadDistance();

const { isLoading, refetch: refetchData } = useGetList(params, {
  refetchOnMounted: false,
  refetchOnWindowFocus: false,
  staleTime: 1000,
  enabled: true,
  onSuccess: async (response) => {
    const items = response.data.data.items;
    const tmp = _.map(items, (item) => {
      return {
        title: item.name_of_to_province_id,
        id: item.to_province_id,
      };
    });

    const provinces = _.uniqBy(tmp, "id").sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    columns.value = provinces;
    let data: any = [];
    provinces.map((i) => {
      let item: any = {
        title: i.title,
        items: [],
      };
      provinces.map((j) => {
        const value =
          items.find(
            (k) => k.to_province_id == i.id && j.id == k.from_province_id
          )?.distance || 0;

        const code =
          items.find(
            (k) => k.to_province_id == i.id && k.from_province_id == j.id
          )?.id || null;

        item.items.push({
          key: [j.id],
          value: value,
          code: code,
        });
      });
      data.push(item);
    });

    await data.sort((a, b) => {
      const titleA = a.title.toUpperCase();
      const titleB = b.title.toUpperCase();

      if (titleA < titleB) {
        return -1;
      }
      if (titleA > titleB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    rows.value = data;

    checkError(response);
  },
});

onMounted(() => {
  // refetch();
});

const checkError = (data) => {
  if (typeof data.data.errorCode !== "undefined") {
    if (data.data.errorCode !== 0) {
      message.error(data.data.errorMessage);
    }
  } else {
    message.error(t("common.system_error"));
  }
};

const showModal = (index, title, data) => {
  index_province.value = index;

  from_province_index.value = title;
  to_province_index.value = columns.value[index].title;

  change_distance.value = data.value;
  id_distance_index.value = data.code;

  visible.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);

  const body = ref<any>({
    id: id_distance_index.value,
    distance: change_distance.value,
  });

  useUploadDistanceData
    .mutateAsync(body.value)
    .then((response) => {
      if (response.data.errorCode === 0) {
        message.success("Cập nhật thành công", 1.5);
        visible.value = false;
      } else {
        console.log("err", response);
        message.error("Cập nhật không thành công", 1.5);
      }
    })
    .catch((err) => {
      console.log(err);
      message.error(t("common.system_error"));
    });
};
</script>

<style scoped lang="scss">
table {
  font-size: 125%;
  white-space: nowrap;
  margin: 0;
  border: none;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  border: 1px solid black;
}
table td,
table th {
  border: 1px solid black;
  padding: 0.5rem 1rem;
}
table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  width: 25vw;
  background: #217242;
  color: white;
}
table td {
  background: #fff;
  padding: 4px 5px;
  text-align: center;
  color: #000;
}

table thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
}
table tbody th {
  position: sticky;
  left: 0;
  background: white;
  z-index: 1;
}
.content_layout {
  overflow-x: inherit;
}
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<style lang="scss">
// chưa scoped được cho màn hình định mức tỉnh
// .layout__content {
//   .container-fluid {
//     overflow-x: scroll;
//   }
// }
</style>
