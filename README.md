# NTNU Notifier

 National Taiwan Normal University (NTNU) Notifier.
 
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

More Details: [Documentation](https://jacoblincool.github.io/ntnu-notifier/).

## Availible Notifiers

* CSIE Notifier (CsieNotifier)
* COVID19 Notifier (Covid19Notifier)
