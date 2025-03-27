import i18n from "@/lang";
import moment from "moment";
import { message } from "ant-design-vue";

const { t } = i18n.global;
import axios from "axios";

export const formatDate = (value:any, format = "DD/MM/YYYY") => {
  return value ? moment(value).format(format) : "";
};
export const getImage = (file_id:string) => {
  return file_id ? `${axios.defaults.baseURL}/file/${file_id}` : "";
};
export const validateImageFile = (file:any, e:any) => {
  const size = 5;
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error(t("validator.file_extension", { extension: "jpg,png" }));
  }
  const isLt5M = file.size / 1024 / 1024 < size;
  if (!isLt5M) {
    message.error(t("validator.max_size", { size }));
  }
  return isJpgOrPng && isLt5M;
};
export const filterByValue = (array:any, string:string, fieldSearch:Array<string>) => {
  return array.filter((o:any) =>
    fieldSearch.some((k:any) => {
      return o[k].toLowerCase().includes(string.toLowerCase());
    })
  );
};
export const formatNumber = (
  amount: any,
  decimalCount: number = 2,
  decimal: string = ".",
  thousands: string = ","
) => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i: any = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.log(e);
  }
};
