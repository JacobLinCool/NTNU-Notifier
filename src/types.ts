/* eslint-disable no-unused-vars */
import Notifier from "./notifier";

export type NotifierEvent = "init" | "check" | "notify";

export interface News {
    title: string;
    url: string;
    date: Date;
    type?: string[];
}

export type Initialize = (notifier: Notifier) => any;
export type Check = (notifier: Notifier) => any;
export type Notify = (notifier: Notifier, news: News) => any;

export interface NotifierHandlerSet {
    init: Initialize[];
    check: Check[];
    notify: Notify[];
}
