import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import cheerio from "cheerio";

const COVID19_NEWS_URL = "https://covid19.ntnu.edu.tw/news_listV2.php";

async function checkout() {
    const res = await fetch(COVID19_NEWS_URL);
    const $ = cheerio.load(await res.text());
    const news: News[] = [];
    const links: string[] = [];
    $("table tr > td:first-child > a").each((idx, elm) => {
        if (idx === 0 || idx >= 16) return;
        const link = $(elm).attr("href");
        if (link) links.push(link);
    });

    await Promise.all(
        links.map(async (url) => {
            const res = await fetch("https://covid19.ntnu.edu.tw/" + url);
            const $ = cheerio.load(await res.text());
            const title = $("table tr:nth-child(1) > td").text().trim();
            const date = new Date($("table tr:nth-child(2) > td").text());
            const type = $("table tr:nth-child(3) > td").text().trim().split(" ");
            news.push({
                title,
                url,
                date,
                type,
            });
        }),
    );

    return news;
}

class Covid19Notifier extends Notifier {
    constructor() {
        super();
        this.name = "Covid19-Notifier";
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
        while (this.memory.length > 15) this.memory.shift();
    }

    recall(news: News[]): Notifier {
        this.memory = news;
        return this;
    }
}

export default Covid19Notifier;
