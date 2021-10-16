import { NotifierEvent, Initialize, Check, Notify } from "./types";

class Notifier {
    public name = "";

    protected memory: any[] = [];

    protected interval: number = 60 * 1000;

    private intervalID: NodeJS.Timer | null = null;

    protected _init: Initialize = (notifier?: Notifier) => {
        this.log("init", notifier);
    };

    protected _check: Check = (notifier?: Notifier) => {
        this.log("check", notifier);
    };

    protected _notify: Notify = (notifier?: Notifier) => {
        this.log("notify", notifier);
    };

    public async start(): Promise<void> {
        const self = this;
        await this._init(this);
        this._check(this);
        this.intervalID = setInterval(() => self._check(self), self.interval);
    }

    public stop(): void {
        if (this.intervalID) clearInterval(this.intervalID);
    }

    public on(event: NotifierEvent, handler: Initialize | Check | Notify): Notifier {
        if (event === "init") this._init = handler as Initialize;
        if (event === "check") this._check = handler as Check;
        if (event === "notify") this._notify = handler as Notify;
        return this;
    }

    protected log(...data: any[]) {
        console.log(`[Notifier ${this.name}]`, ...data);
    }
}

export default Notifier;
