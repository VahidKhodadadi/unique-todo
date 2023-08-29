import { defineStore } from 'pinia';
import { copyToClipboard, isTaskDueDated, loadData, notifyUser, saveData } from '../utilities/helpers';
import router from '../router';

export const useTasksStore = defineStore('tasksLists', {
    state: () => ({
        lists: []
    }),
    // getters: {
    //     lists: (state) => state.lists
    // },
    actions: {
        getListById(listId) {
            return this.$state.lists.find(list => list.id == listId);
        },
        getTaskById(list, taskId) {
            return list.tasks.find(task => task.id == taskId);
        },
        getStepById(task, stepId) {
            return task.steps.find(step => step.id == stepId);
        },
        addList(list) {
            this.$state.lists.push({
                id: Math.ceil(Math.random() * 1000),
                color: list.color,
                createdAtDate: new Date().toISOString(),
                tasks: [],
                title: list.title
            })
            this.save();
        },
        deleteList(listId) {
            const listIndex = this.$state.lists.findIndex(list => list.id == listId);
            this.$state.lists.splice(listIndex, 1);
            this.save();
        },
        addTask(listId, task) {
            const list = this.getListById(listId);
            list.tasks.push({
                completed: false,
                createdAtDate: new Date().toISOString(),
                dueDate: task.dueDate,
                id: Math.ceil(Math.random() * 1000),
                remindMeAtDateTime: task.remindMeAtDateTime,
                steps: [],
                title: task.title
            });
            this.save();
        },
        deleteTask(listId, taskId) {
            const list = this.getListById(listId);
            const taskIndex = list.tasks.findIndex(task => task.id == taskId);
            list.tasks.splice(taskIndex, 1);
            this.save();
        },
        changeTaskStatus(listId, taskId, status) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            task.completed = status;
            this.save();
        },
        addStep(listId, taskId, stepTitle) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            task.steps.push({
                id: Math.ceil(Math.random() * 1000),
                title: stepTitle,
                createdAtDate: new Date().toISOString(),
                completed: false
            });
            this.save();
        },
        deleteStep(listId, taskId, stepId) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const stepIndex = task.steps.findIndex(step => step.id == stepId);
            task.steps.splice(stepIndex, 1);
            this.save();
        },
        changeStepStatus(listId, taskId, stepId, status) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const step = this.getStepById(task, stepId);
            step.completed = status;
            this.save();
        },
        save() {
            saveData(this.$state.lists);
        },
        load() {
            this.$state.lists = loadData();
        },
        duplicateList(listId) {
            const list = this.getListById(listId);
            const newList = {
                ...list,
                id: Math.ceil(Math.random() * 1000)
            }
            this.$state.lists.push(newList);
            this.save();
        },
        renameList(listId, listName) {
            const list = this.getListById(listId);
            list.title = listName;
            this.save();
        },
        searchTasks(searchPhrase) {
            if (searchPhrase.trim() === '') {
                return [];
            }
            const searchResult = [];
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (task.title.includes(searchPhrase)) {
                        searchResult.push(task);
                    }
                }
            }
            return searchResult;
        },
        copyList(listId) {
            const list = this.getListById(listId);
            copyToClipboard(JSON.stringify(list));
        },
        convertStepToTask(listId, taskId, stepId) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const step = this.getStepById(task, stepId);
            task.steps = task.steps.filter(sp => sp.id != stepId);
            const newTask = {
                ...step,
                dueDate: null,
                remindMeAtDateTime: null,
                steps: []
            }
            list.tasks.push(newTask);
        },
        checkForDueDatedTasks() {
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (isTaskDueDated(task.dueDate, task.completed)) {
                        const notification = notifyUser(`Task '${task.title}' deadline is passed. Don't forget to deal with it!`);
                        notification.addEventListener('click', (e) => {
                            router.push(`/task/${list.id}/${task.id}`);
                        })
                    }
                }
            }
        },
        checkForReminders() {
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (isTaskDueDated(task.remindMeAtDateTime, task.completed)) {
                        const notification = notifyUser(`Task '${task.title}' is not completed yet. Don't forget to deal with it!`);
                        notification.addEventListener('click', (e) => {
                            router.push(`/task/${list.id}/${task.id}`);
                        })
                    }
                }
            }
        }
    }
});
