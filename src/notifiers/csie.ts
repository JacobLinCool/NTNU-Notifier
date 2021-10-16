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
        const a = $(elm).find("a");
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

class CsieNotifier extends Notifier {
    constructor() {
        super();
        this.name = "CSIE-Notifier";
        this.on("init", () => {});
        this.on("check", this.check);
    }

    async check() {
        const news = await checkout();
        const newNews = news.filter((x) => !this.memory.find((y) => y.url === x.url));
        for (let i = newNews.length - 1; i >= 0; i--) {
            this.memory.push(newNews[i]);
            this._notify(this, newNews[i]);
        }
        while (this.memory.length > 10) this.memory.shift();
    }

    recall(news: News[]): Notifier {
        this.memory = news;
        return this;
    }
}

export default CsieNotifier;
