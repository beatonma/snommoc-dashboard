import React from "react";
import DateTime from "./components/datetime";
import { NoContent } from "./components/empty";
import { Error, InlineError } from "./components/error";
import { ListItem, ScrollableColumn } from "./components/list";
import { Icon, MaterialIcon } from "./components/symbol";
import { dashboardUrl } from "./local/local";
import "./scss/tasks.scss";

class RecentTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            error: null,
            networkError: null,
        };

        this.update();
    }

    static getDerivedStateFromError(error) {
        return { error: error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);
    }

    update() {
        const url = dashboardUrl("recent-notifications/");
        fetch(url)
            .then(response => response.json())
            .then(json => json.results)
            .then(tasks => this.setState({ tasks: tasks }))
            .catch(err => this.setState({ networkError: err }));
    }

    render() {
        if (this.state.error) {
            return <Error message={this.state.error} />;
        }

        return (
            <section>
                <InlineError message={this.state.networkError} />
                
                <h1>Recent tasks</h1>
                <div className="recent-tasks">
                    <ScrollableColumn>
                        {this.state.tasks.map(task => (
                            <Task key={task.created_on} task={task} />
                        ))}
                    </ScrollableColumn>
                </div>
            </section>
        );
    }
}

function Task(props) {
    const task = props.task;

    let statusClass;
    if (task.failed) statusClass = "failed";
    else if (task.complete) statusClass = "complete";
    else statusClass = "ongoing";

    const cleanTaskTitle = title =>
        title.replace("[Finished] ", "").replace("[Failed] ", "");
    const cleanTaskContent = content =>
        content
            ? "<p>" +
              content
                  ?.replace(/(?:\r\n|\r|\n)/g, "</p><p>")
                  ?.replace(/[\"\']{1}([^\s]+?)[\"\']{1}/g, "<code>$1</code>") +
              "</p>"
            : null;

    return (
        <ListItem className={`task ${statusClass}`}>
            <StatusIcon task={task} />
            <div className="space-between">
                <div>
                    <div className="task-title">
                        {cleanTaskTitle(task.title)}
                    </div>
                    <div
                        className="task-content"
                        dangerouslySetInnerHTML={{
                            __html: cleanTaskContent(task.content),
                        }}
                    ></div>
                </div>
                <TimeStamp
                    started={task.created_on}
                    finished={task.finished_at}
                />
            </div>
        </ListItem>
    );
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
