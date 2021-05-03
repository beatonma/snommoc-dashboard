# Snommoc Dashboard

A simple dashboard overview for managing server content.

-   View recent tasks and their status.
-   View any issues that have been detected in the database - expected relationships that are missing, etc - that may need to be reviewed manually.
-   View the current 'zeitgeist' - content that is currently featured and/or trending.
-   Search for people (bills, divisions, etc) and add/remove them from the featured zeitgeist content.

---

### Requirements

The project expects the following import to work:

```javascript
import Urls from "./local/local";
```

This object should have the following signature:

```javascript
const Urls = {
    api: (path) => url,
    dashboard: (path) => url,
    search: (query) => url,
    tasks: url,
    toggleFeatured: (targetType, id) => url,
    unlinkedConstituency: (id) => url,
    unlinkedConstituencies: url,
    zeitgeist: url,
};
```

---

### Bundle

Check the value of `module.exports.output` in `webpack.config.js` and bundle with:

```bash
npm run build
```
