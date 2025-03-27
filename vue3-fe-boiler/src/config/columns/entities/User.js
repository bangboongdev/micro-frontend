import i18n from "@/lang";
const { t } = i18n.global;
const User = [
  {
    width: 150,
    dataIndex: "username",
    key: "username",
    isNameIndex: true,
  },
  {
    width: 150,
    dataIndex: "avatar_id",
    dataType: "image",
    disableSearch: true,
  },
  {
    width: 200,
    dataIndex: "full_name",
  },
  {
    width: 150,
    dataIndex: "phone_number",
    dataType: "phone",
  },
  {
    width: 200,
    dataIndex: "email",
    dataType: "email",
    ellipsis: true,

  },
  {
    width: 380,
    dataIndex: "name_of_role_ids",
    ellipsis: true,
    dataType: "multiple-list",
  },
  {
    width: 150,
    dataIndex: "is_active",
    dataType: "bool",
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
export default User;
