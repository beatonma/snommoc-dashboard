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
