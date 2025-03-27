const PrintLayout = {
    name: "Mẫu in",
    attribute: {
        type: "Loại",
        size: "",
        warehouse_id: "",
        is_active: "Kích hoạt",
        version: "Phiên bản"
    },
    title:{
        pattern:"Chọn mẫu in",
        warehouse:"Chọn kho áp dụng",
        size:"Chọn khổ in",
        history:"Xem lịch sử",
        print:"In thử",
        edit:"Tùy chỉnh mẫu in",
        addText:"Thêm từ khóa"
    },
    history:{
        title:"Lịch sử chỉnh sửa mẫu in",
        subTitle:"Danh sách chỉ hiển thị 100 lần chỉnh sửa gần nhất."
    },
    keyword:{
        add:'Thêm mới từ khóa',
        title:"Diễn giải",
        code:"Mã",
        select:"Chọn",
        search:"Tìm kiếm từ khóa"
    },
    groupBy:{
        company:"Thông tin công ty",
        purchase_order:"Thông tin phiếu nhập kho",
        purchase_order_item:"Thông tin hàng hóa"
    }
};
export default PrintLayout;