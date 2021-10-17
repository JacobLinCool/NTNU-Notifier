import { Covid19Notifier } from "../lib";

const notifier = new Covid19Notifier();

notifier.listen("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
