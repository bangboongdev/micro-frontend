import moment from "moment/moment";
import { defineComponent, reactive, toRaw, UnwrapRef } from "vue";
import Models from "@/config/models";
import i18n from "@/lang";
import axios from "axios";
import PrintLayoutService from "./services/PrintLayoutService";

const { t } = i18n.global;

export const generateFilterForm = (entities) => {
  // const entities = [...arguments];
  const initialValue = { is_get_summary: 0 };
  const formState = entities.reduce((previousValue, currentValue) => {
    previousValue[currentValue] = {
      key: null,
      value: null,
      tagName: null,
      label: null,
    };
    previousValue[currentValue + "_ids"] = null;
    return previousValue;
  }, initialValue);
  return formState;
};
export const setWarehouseDefault = (warehouses, formState) => {
  if (warehouses.length > 0) {
    formState.warehouse = warehouses[0];
    formState.warehouse.tagName = warehouses[0].value;
    formState.warehouse_ids = warehouses[0].key;
  }
};
export const setEntityWithTag = (tagName, formState) => {
  if (tagName != null) {
    formState[tagName] = {
      key: null,
      value: null,
      tagName: null,
      label: null,
    };
  }
};
export const changeEntity = ($event, formState, entity) => {
  if ($event.value) {
    formState[entity] = $event.value;
    formState[entity + "_ids"] = $event.value?.key;
    formState[entity].tagName = $event.value?.label?.children;
  } else {
    formState[entity] = {
      key: null,
      value: null,
      tagName: null,
      label: null,
    };
    formState[entity + "_ids"] = null;
  }
};
export const generateFormData = (config) => {
  let data = {};
  for (let prop in config) {
    let element = config[prop];
    data[prop] = "";
    switch (element?.dataType) {
      case "object":
        data[prop] = {};
        if (
          element.objectDefault &&
          Object.keys(element.objectDefault).length !== 0
        ) {
          Object.keys(element.objectDefault).map((item) => {
            data[prop][item] = element.objectDefault[item];
          });
        }
        break;
      case "array":
        data[prop] = [];
        break;
      case "number":
        data[prop] = 0;
        if (typeof element.defaultValue != "undefined") {
          data[prop] = element.defaultValue;
        }
        break;
      case "date":
        data[prop] = null;
        if (element.defaultValue === "now") {
          let increment = element.increment || 0;
          data[prop] = moment().add(increment, "days");
        }
        break;
      case "bool":
        data[prop] = null;
        if (typeof element.defaultValue === "undefined") {
          data[prop] = element.defaultValue;
        }
        break;
      case "time":
        data[prop] = null;
        if (element.defaultValue === "now") {
          data[prop] = moment();
        }
        break;
      case "dateTime":
        data[prop] = null;
        if (element.defaultValue === "now") {
          let increment = element.increment || 0;
          data[prop] = moment();
        }
        break;
    }
    if (element?.relation) {
      data[element.relation] = void 0;
    }
  }
  return reactive(data);
};
export const generateFields = (entity) => {
  const fields = Models[entity];
  fields["ins_id"] = {};
  fields["ins_date"] = {};
  fields["upd_id"] = {};
  fields["upd_date"] = {};
  for (const prop in fields) {
    fields[prop].label = t(entity + ".attribute." + prop);
    fields[prop].placeholder = t(entity + ".attribute." + prop);
  }
  fields["ins_id"].label = t("common.attribute.ins_id");
  fields["ins_date"].label = t("common.attribute.ins_date");
  fields["upd_id"].label = t("common.attribute.upd_id");
  fields["upd_date"].label = t("common.attribute.upd_date");

  return fields;
};
export const generateRules = (entity) => {
  const fields = Models[entity];
  console.log(fields);
  let rules = {};
  for (let prop in fields) {
    let field = fields[prop];
    rules[prop] = [];
    if (typeof field.validator != "undefined") {
      rules[prop].push({
        validator: field.validator,
        trigger: field.trigger || "blur",
      });
    } else {
      if (field["relation"]) {
        const relation = field["relation"];
        rules[relation] = [];
        if (typeof field.required != "undefined") {
          rules[relation].push({
            required: true,
            message: t("validator.required", {
              field: t(entity + ".attribute." + prop).toLowerCase(),
            }),
            trigger: field.trigger || "change",
            type: field.type || "any",
          });
        }
      }
      if (typeof field.required != "undefined") {
        rules[prop].push({
          required: true,
          message: t("validator.required", {
            field: t(entity + ".attribute." + prop).toLowerCase(),
          }),
          trigger: field.trigger || "blur",
          type: field.type || "string",
        });
      }
      if (typeof field.min != "undefined") {
        rules[prop].push({
          message: t("validator.min", {
            field: t(entity + ".attribute." + prop).toLowerCase(),
            length: field.min,
          }),
          min: field.min,
          trigger: field.trigger || "blur",
        });
      }
    }
  }
  return reactive(rules);
};
export const printService = (param) => {
  PrintLayoutService.printLayout(param)
    .then((response) => {
      if (response.data.errorCode != 0) {
        if (Array.isArray(response.data.errorMessage)) {
          this.$message.error(
            response.data.errorMessage.map((p) => p.errorMessage).join("\n")
          );
        } else {
          this.$message.warning(response.data.errorMessage);
        }
        return;
      } else {
        let content = response.data.data;
        window.name = "myWindowName";
        let href = window.location.href;
        let print_layout = window.open(
          "",
          "",
          "location=no,toolbar=no,menubar=no,titlebar=no,resizable=no,fullscreen=yes,left=0,top=0"
        );
        print_layout.document.write(content);
        print_layout.print();
        print_layout.close();
      }
    })
    .catch((error) => {
      this.loading = false;
      this.$message.error(error.message);
    });
};
export const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
export const getImage = (file_id) => {
  return file_id ? `${axios.defaults.baseURL}/file/${file_id}` : "";
};
export const validateImageFile = (file, $message) => {
  const size = 5;
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    $message.error(t("validator.file_extension", { extension: "jpg,png" }));
  }
  const isLt5M = file.size / 1024 / 1024 < size;
  if (!isLt5M) {
    $message.error(t("validator.max_size", { size }));
  }
  return isJpgOrPng && isLt5M;
};
export default {
  methods: {
    removeSpecialCharacter(title) {
      return title.replace(/[^a-zA-Z ]/g, "");
    },
    // validateImageFile(file, $message) {
    //   const size = 5;
    //   const isJpgOrPng =
    //     file.type === "image/jpeg" || file.type === "image/png";
    //   if (!isJpgOrPng) {
    //     $message.error(t("validator.file_extension", { extension: "jpg,png" }));
    //   }
    //   const isLt5M = file.size / 1024 / 1024 < size;
    //   if (!isLt5M) {
    //     $message.error(t("validator.max_size", { size }));
    //   }
    //   return isJpgOrPng && isLt5M;
    // },
    // getImage(file_id) {
    //   return file_id ? `${axios.defaults.baseURL}/file/${file_id}` : "";
    // },
  },
};
