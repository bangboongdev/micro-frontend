const Customer = {
  code: {
    max: 20,
  },
  name: {
    required: true,
  },
  description: {
    max: 255,
  },
  is_active: {
    dataType: "number",
    defaultValue: 2,
  },
  avatar_id: {},
  type: {
    dataType: "number",
    defaultValue: 1,
  },
  mobile_no: {
    required: true,
    max: 20,
  },
  email: {
    required: true,
    dataType: "email",
    max: 255,
  },
  address: {
    max: 255,
  },
  tax_code: {
    required: true,
    max: 255,
  },
  delegate: {
     required: true,
    max: 255,
  },
  identify_no: {
    required: true,
    max: 255,
  },
  identify_type: {
    dataType: "number",
    defaultValue: 1,
 },
  sex: {
    dataType: "number",
    defaultValue: 1,
  },
  birth_date: {
    dataType: 'date',
  },
  name_of_province_id: {},
  name_of_district_id: {},
  province_id: {
    relation: "province",
  },
  district_id: {
    relation: "district",
  },
  bank_id: {
    relation: "bank",
  },
  account_number:{},
  name_of_ins_id: {},
  name_of_upd_id: {},
};
export default Customer;
