const { Covid19Notifier } = require("../lib");

const notifier = new Covid19Notifier();

notifier.listen("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
