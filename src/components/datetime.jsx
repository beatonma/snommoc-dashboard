import React from "react";

function DateTime(props) {
    let dateText = "";

    const now = new Date();
    const datetime = new Date(props.datetime);

    const [nowYear, , nowDate] = parseDate(now);
    const [year, , date] = parseDate(datetime);

    if (now - datetime < 3_600_000 * 48) {
        // Dates are within 48 hours of each other.
        if (nowDate == date) {
            dateText = "Today";
        } else {
            now.setDate(now.getDate() - 1);
            if (now.getDate() == date) {
                dateText = "Yesterday";
            }
        }
    }

    if (dateText == "") {
        if (nowYear == year) {
            dateText = datetime.toLocaleString("default", {
                day: "numeric",
                month: "short",
            });
        } else {
            dateText = datetime.toLocaleString("default", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });
        }
    }

    const timeText = datetime.toLocaleTimeString().split(" ")[0];
    const title = props.title || datetime.toLocaleString();

    return (
        <div>
            <time title={title} dateTime={props.datetime}>
                {`${dateText} ${timeText}`}
            </time>
        </div>
    );
}

function parseDate(date) {
    return date
        .toISOString()
        .split("T")[0]
        .split("-")
        .map(it => parseInt(it));
}

export default DateTime;
