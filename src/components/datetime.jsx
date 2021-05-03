import React from "react";
import { extendedClassname } from "../util/elements";
import NoContent from "./empty";

function DateOnly(props) {
    if (props.date == null) {
        return <NoContent />;
    }

    const now = new Date();
    const date = new Date(props.date);

    const [nowYear, ,] = parseDate(now);
    const [year, ,] = parseDate(date);

    let dateText;
    if (nowYear == year) {
        dateText = date.toLocaleString("default", {
            day: "numeric",
            month: "short",
        });
    } else {
        dateText = date.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    return (
        <span className={extendedClassname("", props)}>
            <time title={date.toISOString()} dateTime={props.date}>
                {`${dateText}`}
            </time>
        </span>
    );
}

function DateRange(props) {
    if (props.start == null && props.end == null) {
        return <NoContent />;
    }

    if (props.end == null) {
        return (
            <div className={extendedClassname('daterange', props)}>
                Since <DateOnly date={props.start} />
            </div>
        );
    }

    return (
        <div className={extendedClassname("daterange", props)}>
            <DateOnly date={props.start} /> - <DateOnly date={props.end} />
        </div>
    );
}

/**
 * Display a datetime relative to current datetime.
 */
function DateTime(props) {
    if (props.datetime == null) {
        return <NoContent />;
    }
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

export { DateRange, DateTime, DateOnly };
