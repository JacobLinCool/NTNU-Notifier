/* eslint-disable no-unused-vars */
import Notifier from "./notifier";

export type NotifierEvent = "init" | "check" | "notify";

export interface News {
    id: string;
    title: string;
    url: string;
    date: Date;
    type?: string[];
}

export type Initialize = (notifier: Notifier) => Promise<void> | void;
export type Check = (notifier: Notifier) => Promise<News[]>;
export type Notify = (notifier: Notifier, news: News) => Promise<void> | void;

export interface NotifierHandlerSet {
    init: Initialize[];
    check: Check[];
    notify: Notify[];
}
