import { NotifierEvent, NotifierHandlerSet, Initialize, Check, Notify, News } from "./types";

class Notifier {
    public name = "";
    private _interval: number = 60 * 1000;
    private _intervalID: NodeJS.Timer | null = null;
    public handlers: NotifierHandlerSet = {
        init: [],
        check: [],
        notify: [],
    };

    public async start(): Promise<void> {
        await Promise.all(this.handlers.init.map((handler) => handler(this)));
        Promise.all(this.handlers.check.map((handler) => handler(this)));
        this._intervalID = setInterval(
            () => Promise.all(this.handlers.check.map((handler) => handler(this))),
            this._interval,
        );
    }

    public stop(): void {
        if (this._intervalID) clearInterval(this._intervalID);
    }

    public listen(event: NotifierEvent, handler: Initialize | Check | Notify): Notifier {
        if (event === "init") this.handlers.init.push(handler as Initialize);
        if (event === "check") this.handlers.check.push(handler as Check);
        if (event === "notify") this.handlers.notify.push(handler as Notify);
        return this;
    }

    public on(event: NotifierEvent, handler: Initialize | Check | Notify): Notifier {
        if (event === "init") this.handlers.init = [handler as Initialize];
        if (event === "check") this.handlers.check = [handler as Check];
        if (event === "notify") this.handlers.notify = [handler as Notify];
        return this;
    }

    public async notify(news: News): Promise<void> {
        await Promise.all(this.handlers.notify.map((handler) => handler(this, news)));
    }

    public setInterval(interval: number): Notifier {
        this._interval = interval;
        return this;
    }

    protected log(...data: unknown[]): void {
        console.log(`[Notifier ${this.name}]`, ...data);
    }
}

export default Notifier;
