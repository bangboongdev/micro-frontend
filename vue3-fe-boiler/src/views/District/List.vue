<template>
  <base-page
    :entity="entity"
    :isCustomColumn="true"
    :isAdd="true"
    :isAddSelect="true"
    :isImport="true"
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
     <template #detailList>
      <a-spin :spinning="dataList?.isLoading">
        <detail :form="recordDetail"></detail>
      </a-spin>
    </template>
  </base-page>
    <a-modal
    v-model:visible="isShowModal"
    :title="$t('district.name', { code: form.code })"
    :destroyOnClose="true"
    :closable="true"
    @cancel="hideModal"
    @ok="hideModal"
    :cancel-text="$t('common.back')"
    :bodyStyle="{
      overflowY: 'auto',
      overflowX: 'hidden',
    }"
    wrapClassName="dialog-class"
    target="current_tab"
    ref="modal"
  >
    <detail
      :entity="entity"
      :is-show-modal="isShowModal"
      :form="detail?.data?.data?.data"
    />
  </a-modal>
</template>

<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Detail from "./Detail.vue";
import { useGetList, useDetail } from "@/hooks/district";
import { ref,computed,watch } from "vue";
import i18n from "@/lang";
import { message } from 'ant-design-vue';
const { t } = i18n.global;
const entity = "district";
const filterTable = ref<any>();
const filterList = ref<any>();
const itemId = ref<any>();
const form = ref<any>({});
const isShowModal = ref<boolean>(false);
const recordDetail = ref<any>();
const enabledTable = computed(()=> typeof filterTable.value !== 'undefined');
const enabledList = computed(()=> typeof filterList.value !== 'undefined');
const enabledDetail = computed(()=> typeof itemId.value !== 'undefined');
const getFilterTable = (params: any) => {
  filterTable.value = params;
};
const getFilterList = (params: any) => {
  filterList.value = params;
};
const dataTable = ref<any>(
  useGetList(filterTable, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled:enabledTable,
    staleTime: 10000,
          onSuccess: (data) => {
        checkError(data)
      },
  })
);
const dataList = ref<any>(
  useGetList(filterList, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled:enabledList,
    staleTime: 1000,
          onSuccess: (data) => {
        checkError(data)
      },
  })
);
const detail = ref<{}>(
  useDetail(itemId, {
    refetchOnMounted: false,
    refetchOnWindowFocus: false,
    enabled:enabledDetail,
    staleTime: 10000,
          onSuccess: (data) => {
        checkError(data)
      },
  })
);
const openRecord = (record: number) => {
  isShowModal.value = true;
  itemId.value = record;
};
const hideModal = () => {
  isShowModal.value = false;
};
const setRecordDetail = (record: number) => {
  recordDetail.value = record;
};
const checkError = (data) =>{
  if(typeof data.data.errorCode  !== 'undefined'){
  if(data.data.errorCode !== 0){
      message.error(data.data.errorMessage);
  }
  }
  else{
    message.error(t("common.system_error"));
  }
}
</script>

<style scoped>
</style>