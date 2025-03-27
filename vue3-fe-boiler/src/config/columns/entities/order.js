import i18n from "@/lang";
const { t } = i18n.global;
const Order = [
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
    disableSearch: true,
  },
  {
    width: 200,
    dataIndex: "buyer_id",
  },
  {
    width: 200,
    dataIndex: "status",
  },
  {
    width: 200,
    dataIndex: "customer_id",
  },
  {
    width: 200,
    dataIndex: "product_id",
  },
  {
    width: 200,
    dataIndex: "package_id",
  },
  {
    width: 200,
    dataIndex: "amount",
  },
  {
    width: 200,
    dataIndex: "tax_amount",
  },
  {
    width: 200,
    dataIndex: "commission_amount",
  },
  {
    width: 200,
    dataIndex: "final_amount",
  },
  {
    width: 200,
    dataIndex: "quantity",
  },
  {
    width: 200,
    dataIndex: "payment_type_id",
  },
  {
    width: 200,
    dataIndex: "payment_status",
    dataSource: [
      {
        value: 1,
        text: t("common.paid"),
      },
      {
        value: 0,
        text: t("common.unpaid"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "tax_status",
  },
  {
    width: 200,
    dataIndex: "start_time",
  },
  {
    width: 200,
    dataIndex: "end_time",
  },

];
export default Order;