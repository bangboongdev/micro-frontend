const Partner = {
  code: {
    max: 20,
  },
  name: {
    required: true,
    max: 255,
  },
  description: {
    max: 255,
  },
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  avatar_id: {},
  mobile_no: {
    required: true,
    max: 20,
  },
  email: {
    required: true,
    max: 50,
    dataType: "email",
  },
  address: {
    max: 255,
  },
  name_of_province_id: {},
  name_of_district_id: {},
  province_id: {
    relation: "province",
  },
  district_id: {
    relation: "district",
  },
  tax_code: {
    required: true,
    max: 20,
  },
  delegate: {
    required: true,
    max: 255,
  },
  name_of_ins_id: {},
  name_of_upd_id: {},
  username: {
    required: true,
  },
  password: {
    required: true,
  },
  confirm_password: {
    required: true,
  },
  role: {
    defaultValue: "company",
  }
};
export default Partner;
