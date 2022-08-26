import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const NTNU_CSIE_NEWS_URL = "https://www.csie.ntnu.edu.tw/index.php/category/news/announcement/";

async function checkout(): Promise<News[]> {
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
                .map((x) => x.replace("Post category:", "").trim());
            if (url && title && date) news.push({ id: title, title, url, date, type });
        }
    });
    return news;
}

/** CsieNotifier 的資料來源是 https://www.csie.ntnu.edu.tw/index.php/category/news/announcement/ */
class CsieNotifier extends Notifier {
    constructor(storage?: string, size?: number, interval?: number) {
        super(storage, size, interval);
        this.name = "CSIE-Notifier";
        this.on("check", checkout);
    }
}

export default CsieNotifier;
