import i18n from "@/lang";
const { t } = i18n.global;
const Question = [
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
  },
  {
    width: 200,
    dataIndex: "question_type_id",
  },
  {
    width: 200,
    dataIndex: "content",
  },
  {
    width: 200,
    dataIndex: "answer",
  },

];
export default Question;