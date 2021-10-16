import { CsieNotifier } from "../src";

const notifier = new CsieNotifier();

notifier.on("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
