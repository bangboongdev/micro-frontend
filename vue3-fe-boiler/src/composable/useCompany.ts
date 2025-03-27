import { AxiosResponse } from "axios";
import { ref, computed, onMounted, watch, ComputedRef } from "vue";
import i18n from "@/lang";
const { t } = i18n.global;
import { db } from "@/database/db";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
interface UserCompanyProps {
  file_id: any;
  formState: ComputedRef<Company>;
}
export function useCompany({ file_id, formState }: UserCompanyProps) {
  interface Response {
    data: Company;
  }
  type CompanyResponse = MergeRes<BaseResponse, Response>;

  const formRef = ref();
  const rules = {
    name: [
      {
        required: true,
        message: t("setting.validator.name"),
        trigger: "blur",
      },
    ],
    mobile_no: [
      {
        required: true,
        message: t("setting.validator.mobile_no"),
        trigger: "blur",
      },
    ],
  };

  const province_id = ref<number>();
  const district = ref(null);
  const disabled = ref<boolean>(true);
  const fileList = ref([]);
  const store = useStore();
  const imageUrl = ref<string>("");

  const onChangeProvince = async ($event: any) => {
    if ($event.value) {
      if (db.isOpen()) {
        await db.province.count((el: number) => {
          if (el != 0) {
            db.province
              .where("id")
              .equals($event.value.key)
              .first((e) => {
                province_id.value = e?.province_id;
                console.log(province_id.value);
              });
          }
        });
      }
    }

    disabled.value = false;
    const form = formState.value;
    form.province = $event;
    form.district = undefined;
    form.province_id = $event.value;
    console.log(province_id.value);

    form.district_id = null;
    await setItem(form);
    await onChange($event.value, district.value, "district_id");
  };
  const setItem = async (form: any) => {
    store.commit("company/SET_ITEM_FORM", form);
  };
  const onChange = ($event: any, district: any, field: string) => {
    const value = $event ? $event.key : void 0;
    district?.onLoad({ field, value });
  };
  const onChangeDistrict = async ($event: any) => {
    const form = {
      district: $event,
      district_id: $event.value,
    };
    await setItem(form);
  };

  const onSubmit = () => {
    if (file_id.value && file_id.value != "") {
      formState.value.avatar_id = file_id.value;
    }
    formRef.value.validate().then(() => {
      store
        .dispatch("company/save", formState.value)
        .then((response: AxiosResponse<CompanyResponse>) => {
          if (response.data.errorCode == 0) {
            message.success(t("setting.confirm"));
          }
        })
        .catch((error: ValidateErrorEntity<Company>) => {
          store.dispatch("company/setLoading", false);
          message.error(error);
        });
    });
  };

  return {
    rules,
    formRef,
    disabled,
    province_id,
    formState,
    onSubmit,
    onChangeDistrict,
    onChangeProvince,
  };
}
