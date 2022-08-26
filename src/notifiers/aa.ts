import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const NEWS_URL = "http://www.aa.ntnu.edu.tw/news/news.php?class=1101";

async function checkout(): Promise<News[]> {
    const res = await fetch(NEWS_URL);
    const $ = cheerio.load(await res.text());
    const news: News[] = [];
    $("table tbody tr").each((idx, elm) => {
        const a = $(elm).find("a");
        if (a) {
            const url = "http://www.aa.ntnu.edu.tw/news/" + a.attr("href");
            const title = a.text().trim();
            const date = new Date($(elm).find("td:nth-child(2)").text().trim() || 0);
            const type = $(elm).find("td:nth-child(1)").text().trim().split(" ");
            if (url && title && date) news.push({ id: title, title, url, date, type });
        }
    });
    return news;
}

/** AaNotifier 的資料來源是 https://www.aa.ntnu.edu.tw/news/news.php?class=1101 */
class AaNotifier extends Notifier {
    constructor(storage?: string, size?: number, interval?: number) {
        super(storage, size, interval);
        this.name = "Academic-Affairs-Notifier";
        this.on("check", checkout);
    }
}

export default AaNotifier;
