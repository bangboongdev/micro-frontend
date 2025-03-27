import i18n from "@/lang";
const { t } = i18n.global;
const Utility = [
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
        value: 2,
        text: t("common.active"),
      },
      {
        value: 1,
        text: t("common.inactive"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "avatar_id",
  },
  {
    width: 200,
    dataIndex: "name_of_type_id",
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
    dataIndex: "type_id",
  },
  {
    width: 200,
    dataIndex: "province_id",
  },
  {
    width: 200,
    dataIndex: "district_id",
  },
  {
    width: 200,
    dataIndex: "mobile_no",
  },
  {
    width: 200,
    dataIndex: "email",
    dataType: "email",
  },
  {
    width: 200,
    dataIndex: "name_of_ins_id",
  },
  {
    width: 200,
    dataIndex: "name_of_upd_id",
  },

];
export default Utility;