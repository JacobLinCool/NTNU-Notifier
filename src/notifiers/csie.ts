import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import cheerio from "cheerio";

const NTNU_CSIE_NEWS_URL = "https://www.csie.ntnu.edu.tw/index.php/category/news/announcement/";

async function checkout() {
    const res = await fetch(NTNU_CSIE_NEWS_URL);
    const $ = cheerio.load(await res.text());
    const news: News[] = [];
    $("article").each((idx, elm) => {
        const a = $(elm).find("a").first();
        if (a) {
            const url = a.attr("href");
            const title = a.text();
            const date = new Date($(elm).find(".meta-date").text() || 0);
            const type = $(elm)
                .find(".meta-cat")
                .text()
                .split("/")
                .map((x) => x.trim());
            if (url && title && date) news.push({ title, url, date, type });
        }
    });
    return news;
}

async function check(notifier: CsieNotifier) {
    const news = await checkout();
    const newNews = news.filter((x) => !notifier.memory.find((y) => y.url === x.url));
    for (let i = newNews.length - 1; i >= 0; i--) {
        notifier.memory.push(newNews[i]);
        notifier.notify(newNews[i]);
    }
    while (notifier.memory.length > 10) notifier.memory.shift();
}

/** CsieNotifier 的資料來源是 https://www.csie.ntnu.edu.tw/index.php/category/news/announcement/ */
class CsieNotifier extends Notifier {
    public memory: News[] = [];

    constructor() {
        super();
        this.name = "CSIE-Notifier";
        this.on("check", () => check(this));
    }

    recall(news: News[]): Notifier {
        this.memory = news;
        return this;
    }
}

export default CsieNotifier;
