const Currency = {
  code: {
  max:20
  },
  name: {
    max: 100,
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
  name_of_ins_id: {},
  name_of_upd_id: {},
};
export default Currency;
