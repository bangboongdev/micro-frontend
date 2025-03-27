import i18n from "@/lang";
const { t } = i18n.global;
const Company = [
  {
    width: 200,
    dataIndex: "code",
  },
  {
    width: 200,
    dataIndex: "name",
  },
  {
    width: 200,
    dataIndex: "description",
  },
  {
    width: 200,
    dataIndex: "is_active",
    dataSource: [
      {
        value: 1,
        text: t("common.active"),
      },
      {
        value: 0,
        text: t("common.inactive"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "avatar_id",
    dataType: "image",
  },
  {
    width: 200,
    dataIndex: "mobile_no",
  },
  {
    width: 200,
    dataIndex: "email",
  },
  {
    width: 200,
    dataIndex: "address",
  },
  {
    width: 200,
    dataIndex: "name_of_province_id",
  },
  {
    width: 200,
    dataIndex: "name_of_district_id",
  },
  {
    width: 200,
    dataIndex: "tax_code",
  },
  {
    width: 200,
    dataIndex: "delegate",
  },

];
export default Company;