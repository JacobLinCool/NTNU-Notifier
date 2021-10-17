const { CsieNotifier } = require("../lib");

const notifier = new CsieNotifier();

notifier.listen("notify", (noti, news) => {
    console.log(noti.name, news);
});

notifier.start();
