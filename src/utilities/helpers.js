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