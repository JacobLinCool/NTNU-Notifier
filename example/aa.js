const { AaNotifier } = require("../lib");

const notifier = new AaNotifier();

notifier.on("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
