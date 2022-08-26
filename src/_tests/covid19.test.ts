import { Covid19Notifier } from "..";

jest.setTimeout(15_000);

test("Covid19 Notifier on Notify", async () => {
    const notifier = new Covid19Notifier();

    const waiter = new Promise((resolve) => {
        let i = 0;
        notifier.on("notify", async (noti, news) => {
            expect(noti).toBe(notifier);
            expect(typeof news.title).toBe("string");
            expect(typeof news.url).toBe("string");
            expect(news.date instanceof Date).toBe(true);
            expect(Array.isArray(news.type)).toBe(true);
            i++;
            if (i === 15) resolve(1);
        });
    });

    await notifier.start();
    await waiter;
    notifier.stop();
});
