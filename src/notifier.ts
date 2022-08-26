import { DEFAULT_MEM_SIZE, DEFAULT_INTERVAL } from "./constants";
import {
    NotifierEvent,
    NotifierHandlerSet,
    Initialize,
    Check,
    Notify,
    News,
    FirstShot,
} from "./types";

class Notifier {
    public name = "";
    public handlers: NotifierHandlerSet = {
        init: [],
        check: [],
        notify: [],
        first: [],
    };
    protected _memory: News[] = [];
    protected _size: number;
    protected _interval: number;
    protected _timer?: NodeJS.Timer;

    /**
     * Create a new Notifier instance.
     * @param storage A reference to the News memory array.
     * @param size The maximum number of news to keep in memory.
     * @param interval The interval in milliseconds to check for new news.
     */
    constructor(storage?: News[], size = DEFAULT_MEM_SIZE, interval = DEFAULT_INTERVAL) {
        if (Array.isArray(storage)) {
            this._memory = storage;
        }
        this._size = size;
        this._interval = interval;
    }

    public async start(): Promise<News[]> {
        await Promise.all(this.handlers.init.map((handler) => handler(this)));
        this._timer = setInterval(() => this.check(), this._interval);
        const diff = await this.check();
        await Promise.all(this.handlers.first.map((handler) => handler(this, diff)));
        return diff;
    }

    public stop(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    /**
     * Add a news item to the memory array. Notify triggers will not be fired.
     * @param news List of news to add to the memory.
     */
    public recall(news: News[]): this {
        this._memory.push(...news);
        return this;
    }

    public on(event: "init", handler: Initialize): this;
    public on(event: "check", handler: Check): this;
    public on(event: "notify", handler: Notify): this;
    public on(event: "first", handler: FirstShot): this;
    public on(event: NotifierEvent, handler: Initialize | Check | Notify | FirstShot): this {
        if (event === "init") {
            this.handlers.init.push(handler as Initialize);
        } else if (event === "check") {
            this.handlers.check.push(handler as Check);
        } else if (event === "notify") {
            this.handlers.notify.push(handler as Notify);
        } else if (event === "first") {
            this.handlers.first.push(handler as FirstShot);
        } else throw new Error(`Unknown event: ${event}`);
        return this;
    }

    private async check(): Promise<News[]> {
        try {
            const results = (await Promise.all(this.handlers.check.map((handler) => handler(this))))
                .flat()
                .filter((x) => !this._memory.find((y) => y.id === x.id));
            for (let i = results.length - 1; i >= 0; i--) {
                this._memory.push(results[i]);
                await this.notify(results[i]);
            }
            while (this._memory.length > this._size) this._memory.shift();
            return results;
        } catch (err) {
            this.log(err);
            return [];
        }
    }

    private async notify(news: News): Promise<void> {
        await Promise.all(this.handlers.notify.map((handler) => handler(this, news)));
    }

    protected log(...data: unknown[]): void {
        console.log(`[Notifier ${this.name}]`, ...data);
    }
}

export default Notifier;
