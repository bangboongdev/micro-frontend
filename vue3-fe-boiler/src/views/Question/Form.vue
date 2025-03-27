<template>
  <a-form
    ref="ruleForm"
    :rules="formRules"
    :model="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :layout="layout"
    labelAlign="left"
  >
    <a-row>
      <a-col :span="12">
        <a-form-item :label="fields.avatar_id.label" name="avatar_id">
          <a-upload
            v-model:file-list="fileList"
            name="avatar_id"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :customRequest="customRequest"
            :before-upload="beforeUpload"
            @change="handleChange"
          >
            <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="avatar" />
            <div v-else>
              <loading-outlined v-if="loading"></loading-outlined>
              <plus-outlined v-else></plus-outlined>
              <div class="ant-upload-text">Tải ảnh</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item :label="fields.is_active.label" name="is_active">
          <a-switch
            :checked="form.is_active == 1 ? true : false"
            @change="handleChangeActive"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-row>
          <a-col class="info">Thông tin chung :</a-col>
          <a-col :span="24">
            <a-form-item :label="fields.code.label" name="code">
              <a-input
                v-model:value="form.code"
                :placeholder="fields.code.placeholder"
                :maxlength="50"
              />
            </a-form-item>

            <a-form-item
              :label="fields.question_type_id.label"
              name="question_type"
            >
              <o-select
                ref="question_type"
                :value="form.question_type"
                @input="onChangeQuestionType"
                placeholder="Vui lòng chọn loại câu hỏi"
                entity="question-type"
                :title="'Loại câu hỏi'"
                :icon="'environment'"
                :isDisplay="'none'"
                :isDisplayAdd="'none'"
                textField="name"
                valueField="id"
              />
            </a-form-item>

            <a-form-item :label="fields.name.label" name="name">
              <a-input
                v-model:value="form.name"
                :placeholder="fields.name.placeholder"
                :maxlength="100"
              />
            </a-form-item>

            <a-table
              :data-source="answerList"
              :columns="columns"
              :pagination="false"
            >
              <template #action="{ record }">
                <div>
                  <delete-outlined @click="onDelete(record.key)" style="color: rgb(238, 110, 115)" />
                </div>
              </template>
              <template #answer="{ record }">
                <a-checkbox
                  :checked="1 ? true : false"
                  @click="changeAnswer(record)"
                ></a-checkbox>
              </template>
              <template #value="{ record }">
                <a-form :rules="rulesAnswer">
                  <a-form-item :name="record.content == '' ? 'empty' : 'done'">
                    <a-input v-model:value="record.content" />
                  </a-form-item>
                </a-form>
              </template>
            </a-table>
            <a-button
              class="editable-add-btn"
              @click="handleAdd"
              style="margin: 8px 0 8px 16px"
              ><plus-outlined />Thêm</a-button
            >

            <a-form-item :label="fields.content.label" name="content">
              <a-textarea
                v-model:value="form.content"
                :placeholder="fields.content.placeholder"
                :maxlength="255"
              />
            </a-form-item>

            <a-form-item :label="fields.description.label" name="description">
              <a-textarea
                v-model:value="form.description"
                :placeholder="fields.description.placeholder"
                :maxlength="255"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </a-form>
</template>
<script setup lang="ts">
import formUtility from "@/formUtility";
import { reactive, ref, watch, computed,onMounted } from "vue";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons-vue";
import { getImage, getBase64, validateImageFile } from "@/formUtility";
import { message } from "ant-design-vue";
import FileService from "@/services/FileService";
import i18n from "@/lang";
const { t } = i18n.global;
const loading = ref<boolean>(false);
const props = withDefaults(defineProps<Props>(), {
  formData: {},
  width: "",
  rules: {},
  fields: {},
});
interface Props {
  formData: any;
  width: string;
  rules: any;
  fields: any;
}
const ruleForm = ref<any>();
let inputWidth = ref<string>(props.width ? props.width : "width  100%");
const labelCol = ref<{ span: number }>({ span: 8 });
const wrapperCol = ref<{ span: number }>({ span: 16 });
const layout = ref<string>("horizontal");
const rulesAnswer = {
      empty: [
        { required: true, message: 'Vui lòng nhập câu trả lời', trigger: 'blur' },
      ],}
const answerList = ref<Array<any>>([
  {
    key:0,
    content: "",
    is_correct: 1,
  },
  {
    key:1,
    content: "",
    is_correct: 0,
  },
]);
const form = ref<any>(props.formData);
// form.value.answerList = answerList.value;
const districtDisabled = ref<boolean>(true);
const wardDisabled = ref<boolean>(true);
const imageUrl = ref<any>(getImage(props.formData.avatar_id));
const fileList = ref<any>([]);
const question_type = ref();
const onChangeQuestionType = ($event) => {
  form.value.question_type = $event.value;
};
let formRules = ref<any>({ ...props.rules });
let validateQuestionType = (rule?: any, value?: any) => {
  if(typeof form.value.question_type.label === 'undefined' || form.value.question_type.value == undefined) {
    return Promise.reject(
      t("validator.select_require", {
        field: t("question.attribute.name_of_question_type_id"),
      })
    );
  } else {
    return Promise.resolve();
  }
};
formRules.value.question_type = [
  {
    required: true,
    validator: validateQuestionType,
    trigger: "change",
  },
];
console.log(formRules.value)
const columns = [
  {
    title: "Câu trả lời",
    dataIndex: "value",
    width: "55%",
    slots: {
      customRender: "value",
    },
  },
  {
    title: "Đáp án",
    dataIndex: "answer",
    width: "20%",
    slots: {
      customRender: "answer",
    },
  },

  {
    title: "Hành động",
    dataIndex: "action",
    width: "25%",
    slots: {
      customRender: "action",
    },
  },
];
const count = computed(() => answerList.value.length);
const onDelete = (key:any) => {
  answerList.value = answerList.value.filter((item) => item.key !== key);
    answerList.value.forEach((item) => {
      if (item.key > key) {
        item.key--;
      }
    });
};
onMounted(()=>{
 if(form.value.mode == 'edit'){
      let answerArray = JSON.parse(JSON.stringify(form.value.answerList));
    answerArray.forEach((item, index) => {
      item.key = index;
    });
    console.log(answerArray);
    answerList.value = answerArray;
 }
})
const handleAdd = () => {
  let newAnswerItem = {
    key: answerList.value.length,
    content: "",
    is_correct: 0,
  };
  answerList.value.push(newAnswerItem);
};
const changeAnswer = (record) => {
  if (record.is_correct == 0) {
    record.is_correct = 1;
  } else {
    record.is_correct = 0;
  }
};
const customRequest = (options) => {
  const { onSuccess, onError, file } = options;
  FileService.upload(file)
    .then((response) => {
      onSuccess(response.data.data.file_id);
    })
    .catch((err) => {
      onError(err);
    });
};
const beforeUpload = (file) => {
  return validateImageFile(file, message);
};
const handleChange = (info) => {
  if (info.file.status === "uploading") {
    loading.value = true;
    return;
  }
  if (info.file.status === "done") {
    getBase64(info.file.originFileObj, (base64Url) => {
      imageUrl.value = base64Url;
      loading.value = false;
      form.value.avatar_id = info.file.response;
    });
  }
  if (info.file.status === "error") {
    loading.value = false;
    message.error("upload error");
  }
};

const handleChangeActive = ($event?: any) => {
  if (!$event) {
    form.value.is_active = 0;
  } else {
    form.value.is_active = 1;
  }
};

defineExpose({ ruleForm, form });
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 12px;
}

.info {
  margin-bottom: 16px;
  border-bottom: 1px solid gray;
}

.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>