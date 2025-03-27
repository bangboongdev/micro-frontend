const Role = {
    name: "Vai trò",
    attribute: {
        title: "Tên vai trò",
        name: "Mã vai trò",
        ins_date: "Ngày tạo",
        upd_date: "Ngày sửa",
    },
    extend: {
        permission_info: "Thông tin phân quyền",
    },
    groups: {
        dashboard: "Tổng quan",
        product: "Sản phẩm",
        exam:"Bài thi",
        category:"Danh mục",
        management: "Quản lý",
    },
    roles: {
        activity_log:"Đăng nhập",
        dashboard: "Phân tích báo cáo",
        answer:"Câu trả lời",
        product: "Sản phẩm",
        bank:"Ngân hàng",
        currency:"Tiền tệ",
        exam:"Bài thi",
        objective:"Đối tượng",
        order:"Đơn hàng",
        package:"Gói",
        partner:"Đối tác",
        payment_type:"Loại thanh toán",
        question:"Câu hỏi",
        question_type:"Loại câu hỏi",
        utility:"Tiện ích",
        utility_type:"Loại tiện ích",
        category: "Danh mục hàng hóa",
        print_barcode: "In mã vạch",
        role: "Vai trò",
        user: "Nhân viên",
        customer: "Khách hàng",
        lot: "Lô hàng hoá",
        company: "Công ty",
        import_history: "Lịch sử nhập",
        print_layout: "In",
        audit: "Kiểm toán",
    },
    title:{
        permission:"Quyền"
    }
};
export default Role;