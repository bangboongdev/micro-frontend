<template>
  <div class="content dashboard-content">
    <div class="container">
      <div class="ant-page-header ant-page-header-ghost">
        <div class="ant-page-header-heading">
          <span style="font-size: 20px; font-weight: 600">{{
            $t("setting.attribute.configuration")
          }}</span>
          <span>
            <a-button :size="size"
              ><QuestionCircleOutlined />{{
                $t("setting.attribute.support")
              }}</a-button
            >
          </span>
        </div>
      </div>
      <div class="receipt">
        <a-row :gutter="16">
          <a-col :span="6">
            <span>{{ $t("printLayout.title.pattern") }}</span>
            <a-select
              v-model:value="type"
              style="width: 200px"
              :options="printType"
            ></a-select>
          </a-col>
          <a-col :span="6">
            <span>{{ $t("printLayout.title.warehouse") }}</span>
            <o-select
              ref="warehouse"
              v-model:value="warehouse_id"
              @input="onChangeWareHouse($event)"
              entity="warehouse"
              :isDisplay="'none'"
              :showSearch="false"
              :textField="'name'"
            />
          </a-col>
          <a-col :span="6">
            <span>{{ $t("printLayout.title.size") }}</span>
            <a-select
              v-model:value="size"
              style="width: 200px"
              :options="sizeType"
            ></a-select>
          </a-col>
          <a-col :span="6">
            <span></span><br />
            <button class="history-receipt">
              {{ $t("printLayout.title.history") }}
            </button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <div style="direction: rtl">
              <button @click="print()">
                {{ $t("printLayout.title.print") }}
              </button>
              <button @click="save()">{{ $t("common.edit") }}</button>
            </div>
            <div>
              <editor
                ref="content"
                v-model="content"
                api-key="l81x1vb0q7vp7v7j0pehc6lo4smqg5yjtyul36nj3kybiawg"
                :init="{
                  height: 500,
                  menubar: true,
                  selector: 'textarea',
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
                }"
              />
            </div>
            <div id="form" v-html="item.content"></div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Editor from "@tinymce/tinymce-vue";
import PrintLayoutService from "@/services/PrintLayoutService";
import { defineComponent, ref } from "vue";

interface Props {
  formData: {};
}
const props = withDefaults(defineProps<Props>(), {
  formData: {},
});
const printType = ref([
  {
    value: 1,
    label: "Phiếu nhập kho",
  },
  {
    value: 2,
    label: "Phiếu xuất kho",
  },
  {
    value: 3,
    label: "Phiếu kiểm kê",
  },
  {
    value: 4,
    label: "Phiếu điều chuyển",
  },
]);
const sizeType = ref([
  {
    value: 1,
    label: "Khổ in A4",
  },
  {
    value: 2,
    label: "Khổ in A5",
  },
  {
    value: 3,
    label: "Khổ in K57",
  },
  {
    value: 4,
    label: "Khổ in K80",
  },
]);
const type = ref({
  value: 1,
});
const size = ref({
  value: 1,
});
</script>

<style scoped lang="scss">
</style>