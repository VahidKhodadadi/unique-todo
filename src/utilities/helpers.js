export const saveData = (data) => {
    localStorage.setItem('tasks_data', JSON.stringify(data));
}

export const loadData = () => {
    const data = localStorage.getItem('tasks_data');
    try {
        return JSON.parse(data);
    }
    catch (err) {
        return [];
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