const item = {
  name: "Báo cáo kho",
  description: "Quản lý các hoạt động trong kho",
  attribute: {
    onhand: {
      name: "Báo cáo tồn kho",
      description:
        "Quản lý số lượng và giá trị tồn kho của chi nhánh và toàn hệ thống",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
        icon: "HomeOutlined"
    },
    low_rate: {
      name: "Báo cáo tồn kho dưới định mức",
      description: "Quản lý các sản phẩm có tồn kho dưới định mức",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
      icon: "FallOutlined"

    },
    high_rate: {
      name: "Báo cáo tồn kho trên định mức",
      description: "Quản lý các sản phẩm có tồn kho trên định mức",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
      icon:"RiseOutlined"
    },
    transaction: {
      name: "Sổ kho",
      description: "Quản lý lịch sử giao dịch xuất nhập kho",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
      icon:"FileDoneOutlined"
    },
    detail: {
      name: "Báo cáo tồn kho chi tiết",
      description: "Quản lý hàng hóa ở các trạng thái khác nhau",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
      icon:"CreditCardOutlined"
    },
    export_import_onhand: {
      name: "Báo cáo xuất nhập sản phẩm",
      description:
        "Quản lý các thông tin khi kiểm hàng, số lượng hàng hỏng và lý do",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
        icon:"FileSyncOutlined"
    },
    stock_adjustments: {
      name: "Quản lý tồn đầu kỳ, nhập trong kỳ và tồn cuối kỳ của sản phẩm",
      description: "Quản lý các hoạt động trong kho",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
      },
      icon:"ExceptionOutlined"
    },
    inventories_by_zone: {
      name: "Quản lý tồn kho theo địa điểm",
      description: "Quản lý số lượng hàng tồn kho theo từng khu vực",
      attribute: {
        warehouse: "Kho",
        status: "Trạng thái",
        category: "Loại hàng hóa",
        product: "Hàng hoá",
        zone_group:"Nhóm khu vực",
        zone:"Khu vực"
      },
      icon:"AppstoreAddOutlined"
    },
  },
  common:{
    filter:"Lọc",
    cancel:"Thoát"
  }
};
export default item;
