const Order = {
  code: {},
  name: {},
  description: {},
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  avatar_id: {},
  partner_id:{
    relation: "partner",
  },
  buyer_id: {
    relation: "buyer",
  },
  status: {},
  customer_id: {},
  product_id: {
    relation: "product",
  },
  company_id:{
    relation:"company",
  },
  package_id: {
    relation: "package",
  },
  amount: {},
  tax_amount: {},
  commission_amount: {},
  final_amount: {},
  quantity: {},
  payment_type_id: {
    relation: "payment_type",
  },
  payment_status: {},
  tax_status: {},
  count_order_objective: {},
  count_order_beneficiary: {},
  start_time: {
    // required: true,
    // trigger: "change",
    // type: "object",
  },
  end_time: {
    // required: true,
    // trigger: "change",
    // type: "object",
  },
  orderObjective: {
    dataType: "array",
  },
  orderBeneficiary: {
    dataType: "array",
  },
  orderCustomer: {
    dataType: "object",
    objectRelation: {
      province_id: "province",
      district_id: "district",
      bank_id: "bank",
    },
    objectDefault: {
      type: 1,
      identify_type: 1,
    },
  },
};
export default Order;
