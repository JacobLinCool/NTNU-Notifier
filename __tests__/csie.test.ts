import { CsieNotifier } from "../src";

const csieNotifier = new CsieNotifier();

test("CSIE Notifier Notify", async () => {
    csieNotifier.on("notify", async (noti, news) => {
        expect(noti).toBe(csieNotifier);
        expect(typeof news.title).toBe("string");
        expect(typeof news.url).toBe("string");
        expect(typeof news.date).toBe("string");
        expect(Array.isArray(news.type)).toBe(true);
    });

    await csieNotifier.start();
});
