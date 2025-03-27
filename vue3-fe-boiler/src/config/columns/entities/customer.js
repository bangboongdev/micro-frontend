import i18n from "@/lang";
const { t } = i18n.global;
const Customer = [
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
    dataIndex: "name_of_province_id",
  },
  {
    width: 200,
    dataIndex: "name_of_district_id",
  },
  {
    width: 200,
    dataIndex: "avatar_id",
  },
  {
    width: 200,
    dataIndex: "type",
    dataSource: [
      {
        value: 1,
        text: t("customer.attribute.personal"),
      },
      {
        value: 2,
        text: t("customer.attribute.institute"),
      },
    ],
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
    dataIndex: "tax_code",
  },
  {
    width: 200,
    dataIndex: "delegate",
  },
  {
    width: 200,
    dataIndex: "identify_no",
  },
  {
    width: 200,
    dataIndex: "identify_type",
    dataSource: [
      {
        value: 1,
        text: t("customer.attribute.cccd"),
      },
      {
        value: 2,
        text: t("customer.attribute.cmt"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "sex",
    dataSource: [
      {
        value: 2,
        text: t("customer.attribute.female"),
      },
      {
        value: 1,
        text: t("customer.attribute.male"),
      },
      {
        value: 3,
        text: t("customer.attribute.male"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "birth_date",
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
    dataIndex: "name_of_ins_id",
  },
  {
    width: 200,
    dataIndex: "name_of_upd_id",
  },
  {
    width:200,
    dataIndex:"bank_id",
  },
  {
    width:200,
    dataIndex:"account_number",
  }

];
export default Customer;