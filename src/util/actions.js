import { getCsrfToken } from "./cookies";

export function requestConfig(method) {
    return {
        method: method,
        headers: {
            "Content-Type": "x-www-form-urlencoded",
            "X-CSRFToken": getCsrfToken(),
        },
    };
}

function encodeData(data) {
    return Object.keys(data)
        .map(key => `${key}=${encodeURIComponent(data[key])}`)
        .join("&");
}

export function postData(data) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCsrfToken(),
        },
        body: encodeData(data),
    };
}
