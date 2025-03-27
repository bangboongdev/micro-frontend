const Package = {
  code: {
    max: 20,
  },
  name: {
     required: true,
     max: 255,
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
  amount: {
     required: true,
     max: 50,
  },
  start_time: {
     dataType: 'dateTime'
  },
  end_time: {
     dataType: 'dateTime'
  },
};
export default Package;
