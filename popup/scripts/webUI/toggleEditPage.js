export function toggleEditPage() {
  let key = "useful-scripts/webUI/editPage";
  let currentState = window.localStorage.getItem(key);
  let newState = currentState == 1 ? 0 : 1;

  if (newState) {
    document.body.contentEditable = "true";
    document.designMode = "on";

    alert("Bạn có thể chỉnh sửa ngay bây giờ");
  } else {
    document.body.contentEditable = "false";
    document.designMode = "off";

    alert("Đã tắt chế độ chỉnh sửa");
  }

  window.localStorage.setItem(key, newState);
  window.onbeforeunload = () => {
    window.localStorage.setItem(key, 0);
  };
}
