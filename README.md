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
import { apiUrl, dashboardUrl } from "./local/local";
```

These functions should accept a URL path fragment and construct a usable
URL.

e.g.

```javascript
function apiUrl(path) {
    return `https://my-api.example.com/${path}`;
}
```

---

### Bundle

Check the value of `module.exports.output` in `webpack.config.js` and bundle with:

```bash
npm run build
```
