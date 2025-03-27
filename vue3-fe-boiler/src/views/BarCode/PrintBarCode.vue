<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    :title="$t('printBarcode.name')"
  />
  <div>
    <a-row>
      <a-col :span="14">
        <a-col :span="24" class="product">
          <div class="body">
            <div class="list-bar">
              <div class="form-bar" :fixed="true">
                <a-row :fixed="true">
                  <a-col :span="12">
                    <o-select
                      :placeholder="$t('printBarcode.placeholder.customer')"
                      entity="customer"
                      :value="customer"
                      @input="onChangeCustomer($event)"
                      :showSearch="true"
                      :textField="'name'"
                      :isDisplay="'none'"
                      :style="{ width: selectWidth + '%' }"
                      :fieldValue="{ field: 'type', value: '2' }"
                    />
                  </a-col>
                  <a-col :span="12" :fixed="true">
                    <o-select
                      :value="value"
                      @input="changeProduct"
                      :placeholder="$t('printBarcode.placeholder.product')"
                      :entity="'product'"
                      :isDisplay="'none'"
                      :textField="'name'"
                      :isLabel="false"
                      :option-label-prop="'value'"
                      :typeSearch="'client'"
                      :fieldSearch="['bar_code', 'name']"
                      @getData="getDataSelected"
                      :fieldFilter="'customer_id'"
                      :filters="[
                        {
                          field: 'customer_id',
                          operator: 'equal',
                          value: customer_id,
                        },
                      ]"
                    >
                      <template #customRender="{ item }">
                        <a-row class="list-item">
                          <a-col span="24">
                            <a-row class="row-center">
                              <a-col span="2">
                                <a-image
                                  class="img-product"
                                  :src="getImage(item.avatar_id)"
                                ></a-image>
                              </a-col>
                              <a-col span="22">
                                <div class="item-info">
                                  <div class="item-column">
                                    <span class="title">{{ item.code }}</span>
                                    <span class="sub-title">{{
                                      item.name
                                    }}</span>
                                  </div>
                                </div>
                              </a-col>
                            </a-row>
                          </a-col>
                        </a-row>
                      </template>
                    </o-select>
                  </a-col>
                </a-row>
              </div>
              <div class="table-bar">
                <a-config-provider>
                  <template #renderEmpty>
                    <a-empty>
                      <template #description>
                        <span>
                          {{ $t("common.empty") }}
                        </span>
                      </template>
                    </a-empty>
                  </template>
                  <a-table
                    bordered
                    :data-source="dataSource"
                    :columns="columns"
                    :pagination="false"
                    :scroll="{ y: 300 }"
                    :row-key="(record) => record.id"
                  >
                    <template #quantity="{ record }">
                      <a-input-number
                        v-model:value="record.quantity"
                        :formatter="
                          (value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        "
                        :parser="(value) => value.replace(/(,*)/g, '')"
                      >
                      </a-input-number>
                    </template>
                    <template #operation="{ index }">
                      <a>
                        <DeleteOutlined @click="deleteItem(index)" />
                      </a>
                    </template>
                  </a-table>
                </a-config-provider>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="24" class="sample">
          <div class="printSample">
            <h3>{{ $t("printBarcode.print.template") }}</h3>
          </div>
          <a-row class="barcode">
            <a-col :span="12" class="category">
              <a-row class="subCategory">
                <a-switch
                  class="subCategoryItem"
                  v-model:checked="nameChecked"
                />
                <span>{{ $t("printBarcode.attribute.name") }}</span>
              </a-row>
              <a-row class="subCategory">
                <a-switch
                  class="subCategoryItem"
                  v-model:checked="SKUChecked"
                />
                <span>{{ $t("printBarcode.attribute.SKU") }}</span>
              </a-row>
              <a-row class="subCategory">
                <a-switch
                  class="subCategoryItem"
                  v-model:checked="priceChecked"
                />
                <span>{{ $t("printBarcode.attribute.price") }}</span>
              </a-row>
              <a-row class="subCategory">
                <a-switch
                  class="subCategoryItem"
                  v-model:checked="sizeChecked"
                />
                <span>{{ $t("printBarcode.attribute.size") }}</span>
              </a-row>
            </a-col>
            <!-- <a-col :span="12" class="code">
              <div>
                <div class="cards">
                  <div class="card" v-show="dataSource.length != 0">
                    <h5 class="card-title" v-if="nameChecked">
                      {{ dataSource[0]?.name || "" }}
                    </h5>
                    <vue-barcode
                      :value="dataSource[0]?.bar_code"
                      :options="{ displayValue: false }"
                      tag="svg"
                      v-if="SKUChecked"
                    ></vue-barcode>
                    <h5 v-if="priceChecked">
                      {{
                        dataSource[0]?.price
                          ? formatNumber(dataSource[0].price)
                          : 0
                      }}
                    </h5>
                  </div>
                </div>
              </div>
            </a-col> -->
          </a-row>
        </a-col>
      </a-col>
      <a-col :span="10" class="stamp">
        <a-row class="stamp-title">{{
          $t("printBarcode.print.download_pdf")
        }}</a-row>
        <a-radio-group class="stamp-page__size" v-model:value="selectedFormat">
          <a-row>
            <a-col
              class="stamp-page__size__item"
              :span="8"
              v-for="item in printType"
              :key="item.title"
            >
              <a-col :span="24">
                <a-image id="img" :src="item.image" class="stamp-img" />
              </a-col>
              <a-col :span="24" class="stamp-page__size__item-title">
                <a-radio :value="item.id">{{ item.title }}</a-radio>
              </a-col>
            </a-col>
          </a-row>
        </a-radio-group>
      </a-col>
      <a-col :span="24" v-show="!hiddenExport">
        <div class="download">
          <a-button type="primary" @click="downloadPDF" class="btt-down">
            {{ $t("printBarcode.print.download_pdf") }}
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import "jspdf-barcode";
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import VueBarcode from "@chenfengyuan/vue-barcode";
import _, { truncate } from "lodash";
import { useStore } from "vuex";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { formatNumber, getImage } from "@/utility";

import i18n from "@/lang";
const { t } = i18n.global;
const columns = [
  {
    title: "Mã hàng hoá",
    dataIndex: "bar_code",
    width: "30%",
    key: "bar_code",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
  },
  {
    title: "Số lượng tem",
    dataIndex: "quantity",
    key: "quantity",
    slots: {
      customRender: "quantity",
    },
  },
  {
    title: "",
    dataIndex: "operation",
    slots: {
      customRender: "operation",
    },
  },
];
const SKUChecked = ref(true);
const nameChecked = ref(true);
const priceChecked = ref(true);
const sizeChecked = ref(true);

interface printType {
  id: number;
  title: string;
  image: string;
  size: number;
  row: number;
  column: number;
  fontSize: number;
  paddingLeft: number;
  sizeBarCode: number;
  cellPadding: number;
  spaceY: number;
  minCellHeight: number;
  paddingY: number;
  startY: number;
  orientation: string;
  dataCellY: number;
  format: Array<number> | string;
}
const printType: printType[] = [
  {
    id: 1,
    title: t("printBarcode.page_size.stamp_2"),
    image: require("@/assets/img/72x22.jpg").default,
    size: 2,
    format: [77, 22],
    column: 2,
    row: 1,
    fontSize: 4,
    paddingLeft: 12.5,
    sizeBarCode: 10,
    cellPadding: 1,
    spaceY: 8,
    minCellHeight: 1,
    paddingY: 0.4,
    startY: 0.5,
    orientation: "l",
    dataCellY: 3,
  },
  {
    id: 2,
    title: t("printBarcode.page_size.stamp_3"),
    image: require("@/assets/img/110x22.jpg").default,
    size: 3,
    column: 3,
    row: 1,
    format: [110, 22],
    fontSize: 4,
    paddingLeft: 12.5,
    sizeBarCode: 10,
    cellPadding: 1,
    spaceY: 8,
    minCellHeight: 1,
    paddingY: 0.4,
    startY: 0.5,
    orientation: "l",
    dataCellY: 3,
  },
  {
    id: 3,
    title: t("printBarcode.page_size.A4_138"),
    image: require("@/assets/img/no38.jpg").default,
    size: 100,
    column: 5,
    row: 20,
    format: "a4",
    fontSize: 4,
    paddingLeft: 8.5,
    sizeBarCode: 18,
    cellPadding: 1,
    spaceY: 8,
    minCellHeight: 1,
    orientation: "p",
    paddingY: 1.4,
    startY: 0,
    dataCellY: 0,
  },
  {
    id: 4,
    title: t("printBarcode.page_size.A4_146"),
    image: require("@/assets/img/no146.jpg").default,
    size: 180,
    column: 10,
    row: 18,
    format: "a4",
    fontSize: 4,
    paddingLeft: 0,
    sizeBarCode: 16,
    cellPadding: 1,
    spaceY: 8,
    minCellHeight: 4.6,
    orientation: "p",
    paddingY: 1,
    startY: 0,
    dataCellY: 0,
  },
  {
    id: 5,
    title: t("printBarcode.page_size.A4_145"),
    image: require("@/assets/img/74x22.jpg").default,
    size: 65,
    column: 5,
    row: 13,
    format: "a4",
    fontSize: 6,
    paddingLeft: 7,
    sizeBarCode: 22,
    cellPadding: 1.5,
    spaceY: 26,
    minCellHeight: 3,
    orientation: "p",
    paddingY: 1.8,
    startY: 0,
    dataCellY: 0,
  },
  {
    id: 6,
    title: t("printBarcode.page_size.A5_108"),
    image: require("@/assets/img/no145.jpg").default,
    size: 40,
    column: 5,
    row: 8,
    format: "a5",
    fontSize: 6,
    paddingLeft: 2,
    sizeBarCode: 22,
    cellPadding: 2,
    spaceY: 8,
    minCellHeight: 1.2,
    orientation: "p",
    paddingY: 1.8,
    startY: 0,
    dataCellY: 0,
  },
];
const selectedFormat = ref(1);
const selectWidth = ref(90);
const dataSource = ref<any>([]);
const value = ref([]);
const sample = ref(null);
const customer = ref({});
const customer_id = ref<number | string>();
const dataSelect = ref([]);
interface Item {
  [key: string]: any;
}
interface Props {
  hiddenExport: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  hiddenExport: false,
});
const store = useStore();
const warehouses = computed(() => store.state.warehouse.warehouses);
const ProductService = computed(() => store.getters["product/service"]);

const getDataSelected = ($event: any) => {
  dataSelect.value = $event;
};

const product = ref(null);
const onChangeCustomer = async ($event: any) => {
  if ($event.value) {
    customer_id.value = $event.value?.key;
  }
};
const changeProduct = ($event: any) => {
  value.value = [];
  if ($event.value && $event.value != undefined) {
    let result: any = dataSelect.value.find(
      (item: any) => item.id == $event.value.key
    );
    result.quantity = 1;
    result.key = result.id;
    dataSource.value.push(result);
    dataSource.value = Object.values(
      dataSource.value.reduce((acc: any, item: any) => {
        acc[item.id] = acc[item.id]
          ? { ...item, quantity: item.quantity + acc[item.id].quantity }
          : item;
        return acc;
      }, {})
    );
  }
};

const deleteItem = (index:any) => {
  dataSource.value = dataSource.value.filter((item:any, i:any) => i !== index);
};
const downloadPDF = () => {
  const _printType = printType?.find((p) => p.id == selectedFormat.value);
  if (_printType != undefined) {
    let _orientation = _printType.orientation;
    const pdf :any = new jsPDF('p', "mm", _printType?.format);
    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    let pageIndex = 1;

    let startLocation = _printType?.startY || 15;
    pdf.setPage(pageIndex);
    let startY = startLocation;
    let columns = _printType?.column;
    let index_row = 0;
    let index_col = 0;
    let _items: any = [];
    dataSource.value
      .map((item: any) => ({
        name: truncate(item.name, {
          length: 50,
          separator: " ",
        }),
        bar_code: item.bar_code,
        quantity: item.quantity,
      }))
      .forEach((item:any) => {
        for (let index = 0; index < item.quantity; index++) {
          _items.push(item);
        }
      });

    let firstMarginLeft = 1;

    for (let index = 0; index < _items.length; index++) {
      const element = _items[index];
      index_row = Math.floor(index / _printType.column);
      // số dư cột
      index_col = index % _printType.column;

      columns = index_col + 1;
      if (index_row > 0 && index_col == 0) {
        startY = pdf.lastAutoTable?.finalY || startLocation;
        firstMarginLeft = 1;
      }
      if (index_row + 1 > _printType.row && index % _printType?.size == 0) {
        pdf.addPage();
        startY = startLocation;
      }
      for (let j = index_col; j < columns; j++) {
        let marginLeftFirstColumn = firstMarginLeft;

        pdf.autoTable({
          body: [
            { value: convertViToEn(element.name) },
            { value: "" },
            { value: element.bar_code },
          ],
          rowPageBreak: "auto",
          theme: "grid",
          bodyStyles: {
            lineColor: [255, 255, 255],
          },
          tableLineWidth: 0.2,
          tableLineColor: [0, 0, 0],
          styles: {
            halign: "center",
            valign: "middle",
            fontSize: _printType?.fontSize,
            cellWidth: (pageWidth - 2) / _printType.column,
            font: "times",
            minCellHeight: _printType.minCellHeight,
          },
          tableWidth: (pageWidth - 2) / _printType.column,
          startY: startY,
          margin: {
            left: marginLeftFirstColumn,
            // right: lastMarginRight,
            // bottom:3,
            top: 1,
          },
          columnStyles: {
            value: {
              cellWidth: "auto",
              halign: "center",
              valign: "middle",
              fontSize: _printType.fontSize,
              cellPadding: {
                top: _printType.paddingY,
                bottom: _printType.paddingY,
                left: 1,
                right: 1,
              },
            },
          },

          didDrawCell: function (el: any) {
            if (el.row.index === 1) {
              pdf.barcode(element.bar_code, {
                fontSize: _printType.sizeBarCode,
                textColor: "",
                x: el.cell.x + _printType.paddingLeft,
                y: el.cell.y + (_printType.dataCellY || 5),
              });
            }
          },

          didDrawPage: function (el: any) {
            firstMarginLeft += el.table.getWidth();
          },
        });
      }
    }
    pdf.save("DanhSachHangHoa.pdf");
  }
};
const convertViToEn = (str:any, toUpperCase = false) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");

  str = str.replace(/À|Á|Ạ|Ả|Ă|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ẵ|Ắ|Ặ|Ằ|Ẵ/g, "A");

  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");

  str = str.replace(/È|É|Ẻ|Ẽ|Ẹ|Ê|Ề|Ế|Ể|Ễ|Ệ/g, "E");

  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");

  str = str.replace(/Ì|Í|Ỉ|Ĩ|Ị/g, "I");

  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");

  str = str.replace(/Ò|Ó|Ỏ|Õ|Ọ|Ô|Ồ|Ố|Ổ|Ỗ|Ộ|Ơ|Ờ|Ớ|Ở|Ỡ|Ợ/g, "O");

  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");

  str = str.replace(/Ù|Ú|Ủ|Ũ|Ụ|Ư|Ừ|Ứ|Ử|Ữ|Ự/g, "U");

  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");

  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");

  str = str.replace(/đ/g, "d");

  str = str.replace(/Đ/g, "D");

  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");

  str = str.replace(/\u02C6|\u0306|\u031B/g, "");

  return str;
};
</script>
<style scoped lang="scss">
h2 {
  padding-left: 16px;
  padding-top: 8px;
  margin-bottom: 0;
  font-size: 24px;
}

.product {
  margin: 16px;
  background-color: hsl(0, 0%, 100%);
  height: auto;
  border-radius: 5px;

  :deep(.list-bar) {
    border: 1px solid #c4cdd5;
    height: 58ch;
    border-radius: 5px;
  }

  :deep(.form-bar) {
    padding: 8px 16px;
  }

  :deep(.table-bar) {
    background-color: #ffffff;
  }

  :deep(td) {
    border-right: none !important;
    padding: 8px 16px !important;
  }

  // :deep(ul.ant-table-pagination) {
  //   display: none;
  // }
  :deep(th) {
    border-right: none;
    font-weight: 700;
  }

  :deep(.ant-table-placeholder) {
    border-bottom: none;
  }
}

.sample {
  background-color: #ffffff;
  margin: 0 16px;
  border: 1px solid #c6cdd3;
  border-radius: 5px;

  .printSample {
    padding: 8px 16px;
    h3 {
      margin: 0;
    }
  }

  .barcode {
    align-items: center;
    padding: 16px;

    .category {
      .subCategory {
        padding: 4px 24px;

        span {
          margin-left: 8px;
        }
      }
    }

    .code {
      .cards {
        text-align: center;
      }

      .card {
        box-shadow: none !important;
        margin-bottom: 0 !important;
        border: 1px solid #b1adad;

        :deep(svg) {
          height: 100px;
        }

        .card-title {
          font-weight: 700;
          font-size: 16px;
        }
      }
    }
  }
}

.stamp {
  border: 1px solid #c4cdd5;
  background-color: #fff;
  border-radius: 5px;
  margin-top: 16px;

  :deep(.stamp-title) {
    border-bottom: 1px solid rgb(196, 205, 213);
    padding: 8px;
    font-weight: 600;
  }

  :deep(.stamp-img) {
    max-width: auto;
    height: 128px;
    border: 1px solid #ddd;
    vertical-align: middle;
  }

  .stamp-page__size {
    padding: 0 8px;

    .stamp-page__size__item {
      text-align: center;
      margin-top: 8px;

      .ant-image {
        margin-bottom: 8px;
      }

      .stamp-page__size__item-title {
        margin-top: 8px;
        padding: 0 16px;

        a-radio {
          padding-right: 0;
        }
      }
    }

    .ant-radio-wrapper {
      white-space: normal;
    }
  }
}
.download {
  padding: 16px;
  direction: rtl;
}
.row-center {
  display: flex;
  align-items: center;
  .img-product {
    width: 24px;
    height: 24px;
    object-fit: cover;
    margin-right: 8px;
  }
  .item-info {
    display: flex;
    justify-content: space-between;
    padding-left: 8px;
    align-items: center;
    .item-column {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 12px;
      }
      .sub-title {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}
</style>
