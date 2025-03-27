const QuestionType = {
  code: {
     max:20
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
};
export default QuestionType;
