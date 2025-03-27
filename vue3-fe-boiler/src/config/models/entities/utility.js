const Utility = {
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
    defaultValue: 2,
  },
  avatar_id: {},
  type_id: {
    relation: "type",
  },
  name_of_province_id: {},
  name_of_district_id: {},
  name_of_type_id: {},
  province_id: {
    relation: "province",
  },
  district_id: {
    relation: "district",
  },
  mobile_no: {
    required: true,
    max: 20,
  },
  email: {
    required: true,
    dataType:"email",
    max: 50,
  },

  name_of_ins_id: {},
  name_of_upd_id: {},
};
export default Utility;
