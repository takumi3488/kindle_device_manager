export function createDeviceForm(titleDom: HTMLElement): Boolean {
  // 作成済みなら終了
  if (document.getElementById("device_names_form")) return false;

  // デバイス一覧のDOMを取得
  const uls = document.querySelectorAll("ul");
  if (!uls) return false;
  let ulId = "";
  uls.forEach((ul) => {
    if (ul.getAttribute("id")?.match(/^deliver_to_device_list_[\dA-Z]+$/)) {
      ulId = ul.getAttribute("id")!;
    }
  })
  if (!ulId) return false;

  // デバイス一覧を取得
  const deviceList = document.getElementById(ulId);
  if (!deviceList) return false;
  const deviceListItems = deviceList.querySelectorAll("li");
  if (!deviceListItems) return false;
  const deviceNames = Array.from(deviceListItems).map((item) => item.textContent!);

  // デバイス選択フォームの作成
  const select = document.createElement("select");
  select.multiple = true;
  select.setAttribute("id", "device_names");
  const options = deviceNames.map((name) => {
    const option = document.createElement("option");
    option.setAttribute("value", name);
    option.textContent = name;
    return option;
  });
  options.forEach((option) => select.appendChild(option));
  const form = document.createElement("form");
  const formTitle = document.createElement("h2");
  formTitle.textContent = "一括ダウンロードするデバイスを選択してください";
  form.appendChild(formTitle);
  form.setAttribute("id", "device_names_form");
  form.appendChild(select);
  const submit = document.createElement("input");
  submit.setAttribute("type", "submit");
  submit.setAttribute("value", "実行");
  form.appendChild(submit);

  // デバイス選択フォームのイベントハンドラ
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 選択デバイスを取得して、選択デバイスがなければ終了
    const selectedDeviceNames = Array.from(select.selectedOptions).map((option) => option.value);
    if (!selectedDeviceNames.length) return;

    // formを削除して、選択デバイスをlocalStorageに保存
    form.remove();
    localStorage.setItem("kindle_device_manager", JSON.stringify(selectedDeviceNames));
  });

  // デバイス選択フォームの表示
  titleDom.insertAdjacentElement("afterend", form);
  return true;
}
