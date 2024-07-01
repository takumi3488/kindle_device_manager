import { sleep } from "./deliver";
import { deliver } from "./deliver";
import { createDeviceForm } from "./device_form";

async function main() {
  setTimeout(async () => {
    // ページタイトルのDOMを取得
    const titleDom = document.getElementById("content-page-title");
    if (!titleDom) return;

    const manageKindleDevices = JSON.parse(localStorage.getItem("kindle_device_manager") || "[]");

    // 選択デバイス数が1以上ならダウンロード処理を実行
    if (manageKindleDevices.length) {
      // 選択デバイスをtitleDomの後ろに表示
      const selectedDeviceNames = manageKindleDevices.join(", ");
      const selectedDeviceNamesDom = document.createElement("p");
      selectedDeviceNamesDom.textContent = `実行中：選択デバイス: ${selectedDeviceNames}`;
      titleDom.insertAdjacentElement("afterend", selectedDeviceNamesDom);

      // クエリパラメータからページ番号を取得(なければ1ページ目にリダイレクト)
      const url = new URL(document.URL);
      const page = url.searchParams.get("pageNumber");
      if (!page) {
        url.searchParams.set("pageNumber", "1");
        window.location.href = url.toString();
      }

      // ダウンロード処理を実行
      await sleep(5000);
      await deliver(manageKindleDevices);

      // 次のページがあれば遷移
      const nextPage = Number(page) + 1;
      const pagenation = document.getElementById(`page-${nextPage}`);
      if (pagenation) {
        const nextPageUrl = url.toString().replace(`pageNumber=${page}`, `pageNumber=${nextPage}`);
        window.location.href = nextPageUrl;
      } else {
        localStorage.removeItem("kindle_device_manager");
        window.location.href = "https://www.amazon.co.jp/hz/mycd/digital-console/contentlist/booksAll/dateDsc/"
      }
    } else {
      createDeviceForm(titleDom);
      main();
    }
  }, 500);
}

main();
