import i18n from "@/lang";
const { t } = i18n.global;

const ActivityLog = [{
        width: 100,
        dataIndex: "description",
        isNameIndex: true,
        ellipsis: true,
        fixed: "left",
    },
    {
        width: 100,
        dataIndex: "created_at",
        ellipsis: true,
        dataType: "datetime"
    }
];
export default ActivityLog;