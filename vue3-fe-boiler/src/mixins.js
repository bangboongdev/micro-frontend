import moment from "moment";
export const formatDateTimeVN = (value) => {
  if (value) {
    return moment(String(value)).format("DD-MM-YYYY HH:mm");
  }
};
export default {
  data() {
    return {
      mobileWidth: 426,
      listStatus: [
        {
          id: 0,
          text: "Tất cả",
          styleClass: "",
          sortOrder: 0,
        },
        {
          id: 1,
          text: "Khởi tạo",
          styleClass: "badge badge-light",
          sortOrder: 1,
        },
        {
          id: 2,
          text: "Sẵn sàng",
          styleClass: "badge badge-secondary",
          sortOrder: 2,
        },
        {
          id: 3,
          text: "Chờ nhận hàng",
          styleClass: "badge badge-brown",
          sortOrder: 4,
        },
        {
          id: 4,
          text: "Đang vận chuyển",
          styleClass: "badge badge-blue",
          sortOrder: 5,
        },
        {
          id: 5,
          text: "Hoàn thành",
          styleClass: "badge badge-success",
          sortOrder: 6,
        },
        {
          id: 6,
          text: "Đã hủy",
          styleClass: "badge badge-dark",
          sortOrder: 7,
        },
        {
          id: 7,
          text: "Chờ xử lý",
          styleClass: "badge badge-stpink",
          sortOrder: 3,
        },
      ],
      precedenceEnum: [
        {},
        {},
        {},
        {
          text: "Đặc biệt",
          value: 3,
          star: 3,
        },
        {
          text: "Bình thường",
          value: 4,
          star: 2,
        },
        {
          text: "Thấp",
          value: 5,
          star: 1,
        },
      ],
    };
  },
  methods: {
    formatDateTime(value) {
      if (value) {
        return moment(String(value)).format("HH:mm DD-MM-YYYY");
      }
    },
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD-MM-YYYY");
      } else return value;
    },
    formatDateDB(value) {
      if (value) {
        return moment(String(value)).format("YYYY-MM-DD");
      }
    },
    formatNumber(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } catch (e) {
        console.log(e);
      }
    },
    filterByValue(array, string, fieldSearch) {
      return array.filter((o) =>
        fieldSearch.some((k) => {
          return o[k].toLowerCase().includes(string.toLowerCase());
        })
      );
    },
  },
};
