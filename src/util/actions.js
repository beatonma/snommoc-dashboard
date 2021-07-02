import { getCsrfToken } from "./cookies";
import { DefaultHeaders } from "../local/local";

export function requestConfig(method) {
    return {
        method: method,
        headers: {
            "Content-Type": "x-www-form-urlencoded",
            "X-CSRFToken": getCsrfToken(),
            ...DefaultHeaders,
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
            ...DefaultHeaders,
        },
        body: encodeData(data),
    };
}
