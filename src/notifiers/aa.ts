import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import cheerio from "cheerio";

const NEWS_URL = "https://www.aa.ntnu.edu.tw/news/news.php?class=1101";
const MEM_SIZE = 10 + 2;

async function checkout() {
    const res = await fetch(NEWS_URL);
    const $ = cheerio.load(await res.text());
    const news: News[] = [];
    $("table tbody tr").each((idx, elm) => {
        const a = $(elm).find("a");
        if (a) {
            const url = "https://www.aa.ntnu.edu.tw/news/" + a.attr("href");
            const title = a.text().trim();
            const date = new Date($(elm).find("td:nth-child(2)").text().trim() || 0);
            const type = $(elm).find("td:nth-child(1)").text().trim().split(" ");
            if (url && title && date) news.push({ title, url, date, type });
        }
    });
    return news;
}

async function check(notifier: AaNotifier) {
    const news = await checkout();
    const newNews = news.filter((x) => !notifier.memory.find((y) => y.url === x.url));
    for (let i = newNews.length - 1; i >= 0; i--) {
        notifier.memory.push(newNews[i]);
        notifier.notify(newNews[i]);
    }
    while (notifier.memory.length > MEM_SIZE) notifier.memory.shift();
}

/** AaNotifier 的資料來源是 https://www.aa.ntnu.edu.tw/news/news.php?class=1101 */
class AaNotifier extends Notifier {
    public memory: News[] = [];

    constructor() {
        super();
        this.name = "Academic-Affairs-Notifier";
        this.on("check", () => check(this));
    }

    recall(news: News[]): Notifier {
        this.memory = [...news];
        return this;
    }
}

export default AaNotifier;
