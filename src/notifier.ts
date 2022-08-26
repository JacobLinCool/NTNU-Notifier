import { mapping } from "file-mapping";
import { DEFAULT_MEM_SIZE, DEFAULT_INTERVAL } from "./constants";
import { NotifierEvent, NotifierHandlerSet, Initialize, Check, Notify, News } from "./types";

class Notifier {
    public name = "";
    public handlers: NotifierHandlerSet = {
        init: [],
        check: [],
        notify: [],
    };
    protected _memory: News[] = [];
    protected _size: number;
    protected _interval: number;
    protected _timer?: NodeJS.Timer;

    constructor(storage?: string, size = DEFAULT_MEM_SIZE, interval = DEFAULT_INTERVAL) {
        if (storage) {
            this._memory = mapping(storage, []);
        }
        this._size = size;
        this._interval = interval;
    }

    public async start(): Promise<void> {
        await Promise.all(this.handlers.init.map((handler) => handler(this)));
        this._timer = setInterval(() => this.check(), this._interval);
        this.check();
    }

    public stop(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        }
    }

    public recall(news: News[]): this {
        this._memory = [...news];
        return this;
    }

    public on(event: "init", handler: Initialize): this;
    public on(event: "check", handler: Check): this;
    public on(event: "notify", handler: Notify): this;
    public on(event: NotifierEvent, handler: Initialize | Check | Notify): this {
        if (event === "init") {
            this.handlers.init.push(handler as Initialize);
        } else if (event === "check") {
            this.handlers.check.push(handler as Check);
        } else if (event === "notify") {
            this.handlers.notify.push(handler as Notify);
        } else throw new Error(`Unknown event: ${event}`);
        return this;
    }

    public setInterval(interval: number): Notifier {
        this._interval = interval;
        return this;
    }

    private async check(): Promise<void> {
        try {
            const results = (await Promise.all(this.handlers.check.map((handler) => handler(this))))
                .flat()
                .filter((x) => !this._memory.find((y) => y.id === x.id));
            for (let i = results.length - 1; i >= 0; i--) {
                this._memory.push(results[i]);
                this.notify(results[i]);
            }
            while (this._memory.length > this._size) this._memory.shift();
        } catch (err) {
            this.log(err);
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
