# NTNU Notifier

 National Taiwan Normal University (NTNU) Notifier.

 [![NPM](https://img.shields.io/npm/v/ntnu-notifier.svg?style=flat)](https://www.npmjs.com/package/ntnu-notifier)

## Usage

### Install

```bash
npm i ntnu-notifier
```

### JavaScript or TypeScript

```javascript
const { CsieNotifier, Covid19Notifier } = require("ntnu-notifier");
// import { CsieNotifier, Covid19Notifier } from "ntnu-notifier";

const notifier1 = new CsieNotifier();
const notifier2 = new Covid19Notifier();

notifier1.on("notify", async (notifier, news) => {
    console.log(notifier, news);
});

notifier2.on("notify", async (notifier, news) => {
    console.log(notifier, news);
});

notifier1.start();
notifier2.start();
```

### Multiple Listeners

```javascript
const { CsieNotifier } = require("ntnu-notifier");
const notifier = new CsieNotifier();

notifier.listen("notify", async (notifier, news) => {
    console.log("Listener 1", news);
});
notifier.listen("notify", async (notifier, news) => {
    console.log("Listener 2", news);
});

notifier.start();
```

More Details: [Documentation](https://jacoblincool.github.io/NTNU-Notifier/).

## Availible Notifiers

* CSIE Notifier (CsieNotifier)
* COVID19 Notifier (Covid19Notifier)
* Academic Affairs Notifier (AaNotifier)
