const Bank = {
  code: {
    max: 20,
  },
  name: {
    required: true,
    max: 100,
  },
  description: {
    max: 255,
  },
  is_active: {
    dataType: "number",
    defaultValue: 2,
  },
  avatar_id: {},
  
  name_of_ins_id: {},
  name_of_upd_id: {},
};
export default Bank;
