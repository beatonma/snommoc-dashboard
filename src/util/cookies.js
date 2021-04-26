function getCookie(name) {
    if (!document.cookie) return null;

    const matches = document.cookie
        .split(";")
        .map(c => c.trim())
        .filter(c => c.startsWith(name + "="));

    if (matches.length === 0) return null;
    return decodeURIComponent(matches[0].split("=")[1]);
}

const getCsrfToken = () => getCookie("csrftoken");

export { getCookie, getCsrfToken };
