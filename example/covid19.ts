import { Covid19Notifier } from "../src";

const notifier = new Covid19Notifier();

notifier.on("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
