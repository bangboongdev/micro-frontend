import i18n from "@/lang";
const { t } = i18n.global;
const Product = [
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
    dataIndex: "name_of_category_id",
  },
  {
    width: 200,
    dataIndex: "name_of_company_id",
  },
  {
    width: 200,
    dataIndex: "avatar_id",
  },
  {
    width: 200,
    dataIndex: "company_id",
  },
  {
    width: 200,
    dataIndex: "category_id",
  },
  {
    width: 200,
    dataIndex: "amount",
  },
  {
    width: 200,
    dataIndex: "start_time",
  },
  {
    width: 200,
    dataIndex: "end_time",
  },
  {
    width: 200,
    dataIndex: "is_package",
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

];
export default Product;