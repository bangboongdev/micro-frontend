import i18n from "@/lang";
const { t } = i18n.global;
const Answer = [
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
    dataIndex: "question_id",
  },
  {
    width: 200,
    dataIndex: "name_of_question_id",
  },
  {
    width: 200,
    dataIndex: "is_correct",
    dataSource: [
      {
        value: 1,
        text: t("common.correct"),
      },
      {
        value: 0,
        text: t("common.wrong"),
      },
    ],
  },
  {
    width: 200,
    dataIndex: "content",
  },

];
export default Answer;