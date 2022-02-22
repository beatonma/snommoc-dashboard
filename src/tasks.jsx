import React, { useEffect, useState } from "react";
import { ConfirmButton } from "./components/button";
import { DateTime } from "./components/datetime";
import NoContent from "./components/empty";
import { ListItem, ScrollableColumn } from "./components/list";
import { Popup } from "./components/popup";
import { Tag } from "./components/tag";
import Section from "./components/section";
import { Icon, MaterialIcon } from "./components/symbol";
import Urls from "./local/local";
import { extendedClassname } from "./util/elements";
import "./scss/tasks.scss";

/**
 * Display buttons that trigger a task to run manually.
 */
export function CreateTaskActions(props) {
    return (
        <Section title="Actions">
            <div className="buttons">
                <ConfirmButton onClick={props.updateProfiles}>
                    <span>Update profiles</span>
                </ConfirmButton>

                <ConfirmButton onClick={props.updatePortraits}>
                    <span>Update portrait photos</span>
                </ConfirmButton>

                <ConfirmButton onClick={props.updateBills}>
                    <span>Update bills</span>
                </ConfirmButton>

                <ConfirmButton onClick={props.updateDivisions}>
                    <span>Update divisions</span>
                </ConfirmButton>

                <ConfirmButton onClick={props.updateElectionResults}>
                    <span>Update election results</span>
                </ConfirmButton>
            </div>
        </Section>
    );
}

/**
 * Display recent notifications from tasks.
 */

function RecentTasks() {
    const [tasks, setTasks] = useState([]);
    const [focussed, setFocussed] = useState(null);

    useEffect(() => {
        fetch(Urls.tasks)
            .then(response => response.json())
            .then(json => json.results)
            .then(tasks => setTasks(tasks));
    }, []);

    const onItemClick = task => {
        setFocussed(task);
    };

    return (
        <Section title="Recent tasks" url={Urls.tasks}>
            <div className="recent-tasks">
                <ScrollableColumn>
                    {tasks.map(task => (
                        <TaskListItem
                            key={task.created_on}
                            task={task}
                            onItemClick={onItemClick}
                        />
                    ))}
                </ScrollableColumn>
            </div>
            <FocussedTask task={focussed} onClose={() => setFocussed(null)} />
        </Section>
    );
}

function FocussedTask(props) {
    if (props.task == null) return <NoContent />;
    return (
        <Popup {...props}>
            <Task task={props.task} />
        </Popup>
    );
}

function TaskListItem(props) {
    const task = props.task;

    let statusClass;
    if (task.failed) statusClass = "failed";
    else if (task.complete) statusClass = "complete";
    else statusClass = "ongoing";

    return (
        <ListItem
            className={`task ${statusClass}`}
            onClick={() => props.onItemClick(task)}
        >
            <StatusIcon task={task} />
            <Task {...props} className="space-between" showContent={false} />
        </ListItem>
    );
}

function Task(props) {
    const task = props.task;

    let statusClass;
    if (task.failed) statusClass = "failed";
    else if (task.complete) statusClass = "complete";
    else statusClass = "ongoing";

    const showContent = props.showContent !== false;
    const content = showContent ? (
        <div
            className="task-content"
            dangerouslySetInnerHTML={{
                __html: cleanTaskContent(task.content),
            }}
        ></div>
    ) : (
        <NoContent />
    );

    return (
        <div className={extendedClassname("", props)}>
            <div>
                <div className="task-title">
                    {cleanTaskTitle(task.title)} <TaskWarningsTag task={task} />
                </div>
                {content}
            </div>
            <TimeStamp started={task.created_on} finished={task.finished_at} />
        </div>
    );
}

function TaskWarningsTag(props) {
    const task = props.task;
    if (task === null) return <NoContent />;

    const warningsCount = ((task.content || "").match(/\[warning\]/g) || [])
        .length;

    let warningsMessage;
    if (warningsCount == 0) {
        return <NoContent />;
    } else if (warningsCount == 1) {
        warningsMessage = "1 warning";
    } else {
        warningsMessage = `${warningsCount} warnings`;
    }

    return <Tag className="warning">{warningsMessage}</Tag>;
}

function TimeStamp(props) {
    const start = new Date(props.started);
    const end = props.finished ? new Date(props.finished) : new Date();
    const duration = end - start;

    const title =
        Math.floor(duration / 1000) == 0
            ? start.toLocaleString()
            : `${start.toLocaleString()}\nuntil\n${end.toLocaleString()}`;

    return (
        <div className="task-time">
            <Duration duration={duration} />
            <DateTime title={title} datetime={props.finished ? end : start} />
        </div>
    );
}

function Duration(props) {
    const d = props.duration;

    const totalSeconds = Math.floor(d / 1_000);
    if (totalSeconds == 0) return <NoContent />;

    const totalMinutes = Math.floor(d / 60_000);
    const totalHours = Math.floor(d / 3_600_000);

    const hours = totalHours;
    const minutes = totalMinutes - hours * 60;
    const seconds = totalSeconds - hours * 3600 - minutes * 60;

    const hoursText = hours > 1 ? `${hours}hr` : "";
    const minutesText =
        totalMinutes > 4 && totalMinutes < 56 && totalHours < 4
            ? `${minutes}min`
            : "";
    const secondsText =
        totalMinutes < 15 && seconds > 4 && seconds < 56 ? `${seconds}sec` : "";

    const text = [hoursText, minutesText, secondsText]
        .filter(str => str)
        .join(" ");

    return <div className="task-duration">~{text}</div>;
}

function StatusIcon(props) {
    const task = props.task;

    let icon;
    if (task.failed) icon = Icon.error;
    else if (task.complete) icon = Icon.check;
    else icon = Icon.pending;

    return <MaterialIcon className="status" icon={icon} />;
}

export default RecentTasks;

const cleanTaskTitle = title =>
    title.replace("[Finished] ", "").replace("[Failed] ", "");

const cleanTaskContent = content => {
    if (content?.replace(/(?:\r\n|\r|\n)/g, "")) {
        // If removing whitespace results in usable text, apply formatting.
        const clean = content
            ?.replace(/(?:\r\n|\r|\n)/g, "</p><p>")
            ?.replace(/[\"\']{1}([^\s]+?)[\"\']{1}/g, "<code>$1</code>")
            ?.replace(/(https:\/\/[^\s\[\]\(\)\<\>]+)/g, '<a href="$&">$&</a>');
        return clean ? `<p>${clean}</p>` : null;
    }

    return null;
};
