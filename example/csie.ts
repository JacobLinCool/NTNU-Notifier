import { CsieNotifier } from "../lib";

const notifier = new CsieNotifier();

notifier.on("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
