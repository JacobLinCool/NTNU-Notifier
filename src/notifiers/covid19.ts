import { News } from "../types";
import Notifier from "../notifier";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

const COVID19_NEWS_URL = "https://covid19.ntnu.edu.tw/news_listV2.php";

async function checkout(): Promise<News[]> {
    const res = await fetch(COVID19_NEWS_URL);
    const $ = cheerio.load(await res.text());
    const news: News[] = [];
    const links: string[] = [];
    $("table tr > td:first-child > a").each((idx, elm) => {
        const link = $(elm).attr("href");
        if (link) links.push(link);
    });

    await Promise.all(
        links.map(async (path) => {
            const url = "https://covid19.ntnu.edu.tw/" + path;
            const res = await fetch(url);
            const $ = cheerio.load(await res.text());
            const title = $("table tr:nth-child(1) > td").text().trim();
            const date = new Date($("table tr:nth-child(2) > td").text());
            const type = $("table tr:nth-child(3) > td").text().trim().split(" ");
            news.push({ id: title, title, url, date, type });
        }),
    );

    return news.sort((a, b) => b.date.getTime() - a.date.getTime());
}

/** Covid19Notifier 的資料來源是 https://covid19.ntnu.edu.tw/news_listV2.php */
class Covid19Notifier extends Notifier {
    constructor(storage?: News[], size?: number, interval?: number) {
        super(storage, size, interval);
        this.name = "Covid19-Notifier";
        this.on("check", checkout);
    }
}

export default Covid19Notifier;
