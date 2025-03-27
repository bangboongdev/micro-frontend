import i18n from "@/lang";
const { t } = i18n.global;
 const ImportHistory = [{
         width: 200,
         dataIndex: "ins_id",
         isNameIndex: true,
         fixed: "left",
         ellipsis: true,
     },
     {
         width: 200,
         dataIndex: "module",
     },
     {
         width: 200,
         dataIndex: "file_id",
         dataType: "icon",
     },
     {
         width: 200,
         dataIndex: "type",
     }, {
         width: 250,
         dataIndex: "success_record",
     }, {
         width: 200,
         dataIndex: "error_record",
     },
     //  {
     //      width: 200,
     //      dataIndex: "memo",
     //  },
     //  {
     //      width: 200,
     //      dataIndex: "upd_id",
     //  },
     {
         width: 200,
         dataIndex: "ins_date",
         dataType: "datetime",
     },
     //  {
     //      width: 200,
     //      dataIndex: "upd_date",
     //      dataType: "datetime",
     //  },
     //  {
     //      width: 100,
     //      dataIndex: "del_flag",
     //  },
 ];
 export default ImportHistory;