const Exam = {
  code: {
    max: 20,
  },
  name: {
    required: true,
    max: 20,
  },
  description: {
    max: 255,
  },
  is_active: {
    dataType: "number",
    defaultValue: 1,
  },
  avatar_id: {},
  name_of_product_id: {
     
  },
  product_id: {
     relation: "product",
  },
  total_questions: {
    required: true,
    max: 255,
  },
  time: {
    // required: true,
     dataType: 'time'
  },
  pass_mark: {
    required: true,
    max: 255,
  },
  total_mark: {
    required: true,
    max: 255,
  },
};
export default Exam;
