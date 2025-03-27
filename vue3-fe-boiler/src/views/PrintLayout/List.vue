<template>
  <div class="content dashboard-content">
    <div class="container">
      <a-page-header
        :title="$t('setting.print.title')"
        @back="() => $router.go(-1)"
        style="padding: 24px 0"
      >
        <template #extra>
          <a-button
            type="primary"
            style="background-color: #00885a; border-color: #00885a"
          >
            <template #icon>
              <QuestionCircleOutlined />
            </template>
            {{ $t("setting.attribute.support") }}</a-button
          ></template
        ></a-page-header
      >
      <div class="receipt">
        <a-row :gutter="16">
          <a-col :span="6">
            <span>{{ $t("printLayout.title.pattern") }}</span>
            <a-select
              v-model:value="type"
              label-in-value
              style="width: 100%"
              :options="printType"
              @change="onChangePrint"
            >
            </a-select>
          </a-col>
          <a-col :span="6">
            <span>{{ $t("printLayout.title.warehouse") }}</span>
            <o-select
              :value="warehouse"
              @input="onChangeWareHouse($event)"
              entity="warehouse"
              :isDisplay="'none'"
              :showSearch="false"
              :textField="'name'"
              :placeholder="$t('printLayout.title.warehouse')"
            />
          </a-col>
          <a-col :span="6">
            <span>{{ $t("printLayout.title.size") }}</span>
            <a-select
              v-model:value="size"
              label-in-value
              style="width: 100%"
              :options="sizeType"
              @change="handleChange"
            >
            </a-select>
          </a-col>
          <a-col :span="6">
            <span></span><br />
            <a-button
              type="default"
              class="history-receipt"
              style="padding: 0 !important"
              v-if="!isHidden"
              @click="changeHistory()"
              >{{ $t("printLayout.title.history") }}</a-button
            >
          </a-col>
          <a-col class="content-receipt" :class="[widthContent]">
            <a-col
              :span="24"
              class="content-receipt__btn"
              style="padding: 0 24px"
            >
              <a-button
                type="default"
                @click="save()"
                :loading="isLoading"
                style="
                  background-color: #00885a;
                  border-color: #00885a;
                  color: #fff;
                "
                >{{ $t("common.edit") }}</a-button
              >
              <a-button
                type="default"
                @click="print()"
                style="margin-right: 8px"
                >{{ $t("printLayout.title.print") }}</a-button
              >
            </a-col>
            <div id="form" v-html="item.content"></div>
          </a-col>

          <a-col
            v-if="isDisplay"
            :span="6"
            class="historyChange"
            style="padding: 0"
          >
            <div class="historyChange__title">
              <span class="historyChange__Subtitle"
                >{{ $t("printLayout.history.title") }}
                <span class="historyChange__icon" @click="closeHistory()"
                  ><CloseOutlined /></span
              ></span>
              <span
                ><i>{{ $t("printLayout.history.subTitle") }}</i></span
              >
            </div>
            <div class="listChange">
              <a-list item-layout="horizontal" :data-source="data">
                <template #renderItem="{ item }">
                  <a-list-item
                    @click="selectItem(item)"
                    class="select-item"
                    :class="{ active: item.isActive }"
                  >
                    <a-list-item-meta class="select-item-meta">
                      <template #title>
                        <span>{{ item.ins_date }}</span>
                        <div class="listChange-dot">
                          <div class="green-circle"></div>
                          &ensp;
                          {{ item.username }}
                        </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>

  <a-modal
    v-model:visible="visibleTiny"
    centered
    :closable="false"
    width="100%"
    wrapClassName="full-modal"
    :title="$t('printLayout.title.edit')"
    @ok="handleSave"
    :ok-text="$t('common.save')"
    :cancel-text="$t('common.back')"
    :ok-button-props="{
      style: {
        background: '#00885a',
        borderColor: '#00885a',
        width: '120px',
      },
    }"
    :cancel-button-props="{
      style: { border: 'none' },
    }"
    :confirmLoading="confirmLoading"
  >
    <a-row :gutter="16">
      <a-col span="16">
        <Editor
          ref="content"
          v-model="item.content"
          api-key="l81x1vb0q7vp7v7j0pehc6lo4smqg5yjtyul36nj3kybiawg"
          :init="config"
          @paste="handlePaste"
          @setContent="handleSetContent"
          @addUndo="addUndo"
          @change="handleChange"
          @execCommand="execCommand"
        />
      </a-col>
      <a-col span="8">
        <Keyword
          :print-layout-items="printLayoutItems"
          @handleChoose="handleChoose"
        ></Keyword>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script setup lang="ts">
import BasePage from "@/views/BasePage/BasePage.vue";
import Editor from "@tinymce/tinymce-vue";
import Keyword from "./Keyword.vue";
import {
  LeftOutlined,
  QuestionCircleOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import Icon from "@ant-design/icons-vue";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import i18n from "@/lang";
const { t } = i18n.global;
const entity = ref("print-layout");
const config = {
  height: 750,
  menubar: true,
  selector: "textarea",
  plugins: [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
  ],
  toolbar:
    "undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help",
};
const printType = ref([
  {
    value: "1",
    label: "Phiếu nhập kho",
  },
  {
    value: "2",
    label: "Phiếu xuất kho",
  },
  {
    value: "3",
    label: "Phiếu kiểm kê",
  },
  {
    value: "4",
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
const printLayoutItems = ref({});
const type = ref({
  value: "1",
});
const size = ref({
  value: 1,
});
interface Item {
  isActive: boolean;
  version?: string;
  content: any;
}
const item = ref<Item>({
  isActive: true,
  content: "",
});
const isHidden = ref(false);
const isDisplay = ref(false);
const widthContent = ref("ant-col-24");
const data = ref([]);
const isActive = ref(false);
const visibleTiny = ref(false);
const textSearch = ref("");
const warehouse = ref<any>(void 0);
const isLoading = ref(false);
const confirmLoading = ref(false);

const handleSave = () => {
  const chars:any = {
    "<footer": "<div>",
    "</footer>": "</div>",
    "<audio": "<div>",
    "</audio>": "</div>",
    "<main": "<div>",
    "</main>": "</div>",
    "<section": "<div>",
    "</section>": "</div>",
    "<article": "<div>",
    "</article>": "</div>",
    "<paragraph": "<div>",
    "</paragraph>": "</div>",
  };
  let content ='';
  //  tinymce.activeEditor.getContent();
  let Rex = new RegExp(Object.keys(chars).join("|"), "gi");
  content = content.replace(Rex, (m) => chars[m]);
  console.log(content);
  let warehouse_id = warehouse.value?.key;
  let data = {
    content: content,
    type: type.value.value,
    warehouse_id: warehouse_id,
  };
  confirmLoading.value = true;
  PrintLayoutService.value
    .saveContent(data)
    .then((response: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p:any) => p.errorMessage).join("\n")
          );
        } else {
          message.warning(response.data.errorMessage);
        }
        return;
      }
      const _message = t("common.save_success", {
        // entity: title.value,
      });
      message.success(_message);
      visibleTiny.value = false;
      confirmLoading.value = false;
      // getLayoutDefault(type, warehouse_id, null);
    })
    .catch((error: any) => {
      console.error(error);
      confirmLoading.value = false;
      message.error(error.message);
    });
};
const save = async () => {
  await getPrintLayoutItems();
};
const getPrintLayoutItems = () => {
  console.log("getPrintLayoutItems");

  isLoading.value = true;
  const _type = type.value.value;
  PrintLayoutService.value
    .getPrintLayoutItems(_type)
    .then((response: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p:any) => p.errorMessage).join("\n")
          );
        } else {
          message.warning(response.data.errorMessage);
        }
        return;
      }
      isLoading.value = false;
      printLayoutItems.value = response.data.data;
      visibleTiny.value = true;
    })
    .catch((error:any) => {
      console.error(error);
      isLoading.value = false;
      message.error(error.message);
    });
};
const onChangeWareHouse = async ($event: any) => {
  console.log("onChangeWareHouse");
  // warehouse.value = $event;
  store.dispatch;
  const _type = type.value.value;
  const warehouse_id = $event.value.key;
  getLayoutDefault(_type, warehouse_id, null);
  closeHistory();
  data.value = [];
};
const onChangePrint = async () => {
  console.log("onChangePrint");

  const _type = type.value.value;
  const warehouse_id = warehouse.value.key;
  getLayoutDefault(_type, warehouse_id, null);
  closeHistory();
  data.value = [];
};

const changeHistory = async () => {
  console.log("changeHistory");

  isHidden.value = true;
  isDisplay.value = true;
  widthContent.value = "ant-col-18";
  const _type = type.value.value;
  let warehouse_id = warehouse.value.key;
  getHistory(_type, warehouse_id);
};
const closeHistory = () => {
  isHidden.value = false;
  isDisplay.value = false;
  widthContent.value = "ant-col-24";
};
const selectItem = (item:any) => {
  item.isActive = true;
  const _type = type.value.value;
  const warehouse_id = warehouse.value.key;
  const version = item.version;
  getLayoutDefault(type, warehouse_id, version);
};
const handleChoose = (item: any) => {
  const code = item.merge_field;
  // tinymce.activeEditor.insertContent(code);
};
const defaultValue = () => {
  const _warehouses = warehouses.value;
  if (_warehouses != null) {
    warehouse.value = _warehouses ? _warehouses[0] : void 0;
  }
};
const getLayoutDefault = (type: any, warehouse_id: any, version: any) => {
  PrintLayoutService.value
    .getLayoutDefault(type, warehouse_id, version)
    .then((response: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p:any) => p.errorMessage).join("\n")
          );
        } else {
          message.warning(response.data.errorMessage);
        }
        return;
      }
      item.value.content = response.data.data ? response.data.data.content : "";
    })
    .catch((error: any) => {
      console.error(error);
      isLoading.value = false;
      message.error(error.message);
    });
};
const getHistory = (type: any, warehouse_id: any) => {
  console.log("getHistory");

  PrintLayoutService.value
    .getHistoryByType(type, warehouse_id)
    .then((response: any) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          message.error(
            response.data.errorMessage.map((p:any) => p.errorMessage).join("\n")
          );
        } else {
          message.warning(response.data.errorMessage);
        }
        return;
      }
      let data = response.data.data.map((item: any) => ({
        ...item,
        isActive: false,
      }));
      data = data;
    })
    .catch((error: any) => {
      console.error(error);
      isLoading.value = false;
      message.error(error.message);
    });
};

const print = () => {
  console.log("print");

  let content = item.value.content;
  window.name = "myWindowName";
  let href = window.location.href;
  let print_layout: any = window.open(
    "",
    "",
    "location=no,toolbar=no,menubar=no,titlebar=no,resizable=no,fullscreen=yes,left=0,top=0"
  );
  print_layout.document.write(content);
  print_layout.print();
  print_layout.close();
};
const store = useStore();
onMounted(async () => {
  store.dispatch("warehouse/getWarehouse");
  defaultValue();
  getLayoutDefault(type.value.value, warehouse.value.key, null);
});
const warehouses = computed(() => store.state.warehouse.warehouses);
const PrintLayoutService = computed(() => store.getters["printLayout/service"]);
</script>
<style scoped lang="scss">
.content,
.dashboard-content {
  background-color: #f4f6f8;

  .container {
    background-color: #f4f6f8;
    width: 88%;
    margin: 0 auto;

    .receipt {
      .ant-select-selector {
        margin-top: 8px;
      }
      .history-receipt {
        width: 100%;
        min-height: 32px;
      }
      .content-receipt {
        margin: 16px 0;
        height: 73vh;
        overflow: auto;
        padding: 0;
        background: #fff;
        .content-receipt__btn {
          direction: rtl;
          width: 100%;
          background-color: #fff;
          border-bottom: none;
          min-height: 72px;
          line-height: 72px;
          border-bottom: 1px solid #dfe4e8;
          z-index: 1;
          position: sticky;
          top: 0;
        }
        #form {
          padding: 24px;
          background-color: #fff;
        }
      }
    }

    .historyChange {
      background-color: #fff;
      margin: 16px -10px;
      border: 1px solid #dfe4e8;

      .historyChange__title {
        border-bottom: 1px solid #dfe4e8;
        padding: 0 16px;
        min-height: 73px;

        .historyChange__Subtitle {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
          font-size: 16px;
        }
        .historyChange__icon {
          cursor: pointer;
        }
      }
      .ant-list-item {
      }
      .listChange {
        .selectItem {
          font-size: 16px;
          color: #00885a;
        }

        .green-circle {
          height: 10px;
          width: 10px;
          background-color: #26a69a;
          border-radius: 50%;
        }
        .listChange-dot {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.full-modal {
  .ant-modal,
  .ant-modal-content {
    height: 100vh;
    width: 100vw;
    margin: 0;
    top: 0;
  }
  .ant-modal-body {
    height: calc(100vh - 110px);
    overflow: auto;
  }
  .ant-modal-header {
    border-bottom: 0;
    .ant-modal-title {
      font-weight: bold !important;
    }
  }
}
.block-item {
  display: block;
}
.search-keyword {
  margin-bottom: 8px;
}
.text-bold {
  font-weight: 600;
}
.select-item {
  cursor: pointer;
  padding: 0;
  .select-item-meta {
    padding: 8px 16px;
  }
}
.select-item.active {
  background: #e0e0e0;
}
.select-item :hover {
  background: #e0e0e0;
}
</style>

