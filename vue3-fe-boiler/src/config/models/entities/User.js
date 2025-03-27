const User = {
  username: {
    required: true,
    max: 255,
  },
  avatar_id: {},
  full_name: {
    max: 255,
    required: true,
  },
  phone_number: {
    required: true,
    min: 10,
    max: 15,
  },
  email: {
    max: 255,
    required: true,

  },
  password: {
    required: true,
    min: 8,
    trigger: "change",
  },
  confirm_password: {
    required: true,
    min: 8,
    trigger: "change",
    required: true,
  },
  warehouse_ids: {
    required: true,
    relationMultiple: "warehouse",
  },
  role_ids: {
    required: true,
    relationMultiple: "role",
  },
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  entity_id: {
    dataType: "number",
  },
};
export default User;
