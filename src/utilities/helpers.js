export const saveTasksData = (data) => {
    localStorage.setItem('unique_todo_tasks_data', JSON.stringify(data));
}

export const loadTasksData = () => {
    const data = localStorage.getItem('unique_todo_tasks_data');
    try {
        return JSON.parse(data || []);
    }
    catch (err) {
        return [];
    }
}

export const saveConfigs = (configsData) => {
    localStorage.setItem('unique_todo_configs', JSON.stringify(configsData));
}

export const loadConfigs = () => {
    const data = localStorage.getItem('unique_todo_configs');
    try {
        return JSON.parse(data || null);
    }
    catch (err) {
        return null;
    }
}

export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        console.log(JSON.parse(text));
    });
}

export const notifyUser = message => {
    if (!('Notification' in window)) {
        console.log('Notification API is not available!');
        return;
    }
    else if (Notification.permission === 'granted') {
        return new Notification(message);
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                return new Notification(message);
            }
        })
    }
}

export const isTaskDueDated = (date, completed) => {
    return (
        date && // has due date
        new Date(date).getTime() < new Date().getTime() && // due date is passed
        completed === false // task is not completed
    )
}