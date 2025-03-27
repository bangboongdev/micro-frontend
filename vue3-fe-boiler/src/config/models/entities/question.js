const Question = {
  code: {
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
  question_type_id: {
    relation: "question_type",
  },
  content: {},
  answer: {},
  answerList:{},
};
export default Question;
