const Company = {
  code: {
   max: 20,
  },
  name: {
   required: true,
  },
  description: {},
  is_active: {
   dataType: "number",
   defaultValue: 1,
  },
  avatar_id: {},
  mobile_no: {
   required: true,
  },
  email: {
   required: true,
  },
  address: {},
  name_of_province_id:{},
  name_of_district_id:{},
  province_id: {
     relation: "province",
  },
  district_id: {
     relation: "district",
  },
  tax_code: {
   required: true,
  },
  delegate: {
   required: true,
  },
  username: {
   required: true,
  },
  password: {
   required: true,
  }
};
export default Company;
