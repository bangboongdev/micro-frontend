<template>
  <base-page 
  ref="page" 
  :entity="entity" 
  :isShowBack="false" 
  :isAdd="true" 
  :isAction="true" 
  :widthModal="width"
  :isImport="true" 
  :isCustomColumn="true" 
  :isAddSelect="true" 
  :isViewType="true"
  @emitDataTable="getFilterTable($event)" 
  @emitDataList="getFilterList($event)" 
  @openRecord="openRecord($event)"
  @recordDetail="setRecordDetail($event)" 
  :dataTable="dataTable?.data?.data" 
  :dataList="dataList?.data?.data"
  :tableLoading="dataTable?.isLoading" 
  :listLoading="dataList?.isLoading"
  >
    <template #tabs>
      <a-tabs 
      v-model:activeKey="activeKey" 
      :tabBarGutter="0" 
      :tabBarStyle="styleTabs" 
      @change="changeTab">
        <a-tab-pane 
        v-for="item in statuses" 
        :key="item.value" 
        :tab="item.text"
        >
      </a-tab-pane>
      </a-tabs>
    </template>
  </base-page>
</template>
<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import { computed, onMounted, ref, watch } from "vue";
import { useGetList, useDetail } from "@/hooks/user";
import user from "@/store/modules/user";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = "user";
const filterTable = ref<any>();
const filterList = ref<any>();
const styleTabs = { margin: 0 };
const width = "900px";
const page: any = ref();
const statuses = [
  {
    value: -1,
    text: t("user.extend.all"),
  },
  {
    value: 1,
    text: t("user.extend.active"),
  },
  {
    value: 0,
    text: t("user.extend.inactive"),
  },
];
const getFilterTable = (params: any) => {
  filterTable.value = params;
};
const filterRole = () => { 
  filterTable.value.filters.push({field: "role", value: user.state.loginObj.role, });
  filterTable.value.filters.push({field: "entity_id", value: user.state.loginObj.entity_id , });
}
watch(filterTable, filterRole);
const getFilterList = (params: any) => {
  filterList.value = params;
};
const dataTable = ref<any>(
  useGetList(filterTable, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 10000,
  })
);
const dataList = ref<any>(
  useGetList(filterList, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    staleTime: 1000,
  })
);
const changeTab = (key) => {
  let filter = {};
  filter = {
    field: "is_active",
    operator: key != -1 ? "equal" : "isNotNull",
    value: key != -1 ? [key] : null,
  };
  page.value.reload(filter);
};
</script>
