export function sleep(msec: number) {
  return new Promise(resolve => setTimeout(resolve, msec));
}

export async function deliver(deviceNames: string[]) {
  // 全てのボタンを取得
  const btns = document.getElementsByClassName("action_button");
  if (!btns) return;

  // 「デバイスからの配信または削除」ボタンを取得
  const deliverBtns = Array.from(btns).filter((btn) => btn.getAttribute("id")?.match(/^DELIVER_OR_REMOVE_FROM_DEVICE_ACTION_([\dA-Z]+)$/));
  if (!deliverBtns) return;

  for (const deliverBtn of deliverBtns) {
    // ボタンをクリック
    (deliverBtn as HTMLElement).click();

    // デバイス選択ダイアログを取得
    const bookId = deliverBtn.getAttribute("id")?.match(/^DELIVER_OR_REMOVE_FROM_DEVICE_ACTION_([\dA-Z]+)$/)?.[1];
    if (!bookId) return;
    const dialogId = `deliver_to_device_list_${bookId}`;
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    // ダイアログからデバイスを選択
    let isChanged = false;
    const listItems = dialog.querySelectorAll("li");
    if (!listItems) return;
    listItems.forEach((item) => {
      const deviceName = item.textContent!;
      const input = item.querySelector("input")!;
      const isChecked = input.checked;
      if (deviceNames.includes(deviceName) && !isChecked) {
        input.click();
        isChanged = true;
      } else if (!deviceNames.includes(deviceName) && isChecked) {
        input.click();
        isChanged = true;
      }
    })

    await sleep(2000)

    // 変更を反映
    if (isChanged) {
      const submitBtn = document.getElementById(`DELIVER_OR_REMOVE_FROM_DEVICE_ACTION_${bookId}_CONFIRM`);
      (submitBtn as HTMLElement).click();
    } else {
      const cancelBtn = document.getElementById(`DELIVER_OR_REMOVE_FROM_DEVICE_ACTION_${bookId}_CANCEL`);
      (cancelBtn as HTMLElement).click();
    }

    // ダイアログを閉じる
    await sleep(2000);
    const closeBtn = document.getElementById(`notification-close`);
    closeBtn?.click();
  }
}
