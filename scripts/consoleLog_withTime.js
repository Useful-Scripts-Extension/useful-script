export default {
  icon: "",
  name: {
    en: "console.log with time",
    vi: "console.log - hiển thị thời gian",
  },
  description: {
    en: "Add prefix execution time to console.log",
    vi: "Hiển thị thêm thời gian chạy lệnh vào trước console.log",
  },

  onDocumentStart: () => {
    const origLog = console.log;
    console.log = function () {
      // add time to console.log
      origLog(
        `${UfsGlobal.Utils.formatTimeToHHMMSSDD(new Date())} | `,
        ...arguments
      );
    };
  },
};
