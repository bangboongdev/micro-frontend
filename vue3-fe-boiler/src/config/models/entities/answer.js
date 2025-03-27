const Answer = {
  code: {},
  name: {
    required: true,
  },
  description: {},
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  avatar_id: {},
  name_of_question_id:{},
  question_id: {
     relation:'question'
  },
  is_correct: {
    dataType: "number",
    defaultValue: 1,
  },
  content: {},
};
export default Answer;
