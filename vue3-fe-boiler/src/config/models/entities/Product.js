const Product = {
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
  name_of_category_id:{},
  name_of_company_id:{},
  company_id: {
     relation: "company",
     
  },
  category_id: {
     relation: "category",
     
  },
  amount: {
    required: true,
  },
  start_time: {
    dataType:'dateTime'
  },
  end_time: {
    dataType:'dateTime'
  },
  is_package: {
    dataType: "number",
      defaultValue: 1,
  },
};
export default Product;
