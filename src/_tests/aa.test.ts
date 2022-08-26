import { AaNotifier } from "..";

test("Academic Affairs Notifier on Notify", async () => {
    const notifier = new AaNotifier();

    const waiter = new Promise((resolve) => {
        let i = 0;
        notifier.on("notify", async (noti, news) => {
            expect(noti).toBe(notifier);
            expect(typeof news.title).toBe("string");
            expect(typeof news.url).toBe("string");
            expect(news.date instanceof Date).toBe(true);
            expect(Array.isArray(news.type)).toBe(true);
            i++;
            if (i === 10) resolve(1);
        });
    });

    await notifier.start();
    await waiter;
    notifier.stop();
});
