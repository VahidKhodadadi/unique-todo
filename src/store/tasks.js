import { defineStore } from 'pinia';
import { copyToClipboard, isTaskDueDated, loadTasksData, notifyUser, saveTasksData, saveConfigs, loadConfigs } from '../utilities/helpers';
import router from '../router';
import IranFlag from '../assets/country-flags/iran.png';
import USAFlag from '../assets/country-flags/united-states-of-america.png';

export const countries = [
    {
        name: 'United States',
        shortName: 'US',
        direction: 'ltr',
        language: 'English',
        lang: 'en',
        currency: '$',
        flag: USAFlag
    },
    {
        name: 'Islamic Republic of Iran',
        shortName: 'Iran',
        direction: 'rtl',
        language: 'Persian (Farsi)',
        lang: 'fa',
        currency: 'Rial',
        flag: IranFlag
    }
]

export const useTasksStore = defineStore('tasksLists', {
    state: () => ({
        lists: [],
        configs: {
            country: countries[0],
            languageData: {}
        }
    }),
    // getters: {
    //     lists: (state) => state.lists
    // },
    actions: {
        translate(keyChain) {
            const tempLanguageData = this.$state.configs.languageData;
            if (!tempLanguageData) {
                return '';
            }
            const chainArr = keyChain.split('.');
            const translatedText = chainArr.reduce((previous, current) => {
                if (!previous[current]) {
                    return [];
                }
                return previous[current];
            }, tempLanguageData);
            return translatedText;
        },
        setLanguageData(newLanguageData) {
            this.$state.configs = {
                ...this.$state.configs,
                languageData: newLanguageData
            }
        },
        setConfigKey(key, value) {
            this.configs[key] = value;
            const { languageData, ...otherConfigs } = {
                ...this.configs,
                [key]: value
            };
            saveConfigs(otherConfigs);
        },
        saveConfigs() {
            saveConfigs(this.$state.configs);
        },
        loadConfigs() {
            const configsData = loadConfigs();
            const langFileName = configsData ? configsData.country.lang : countries[0].lang;
            import(`../assets/languages/${langFileName}.json`)
                .then(newLanguageData => {
                    document.dir = configsData ? configsData.country.direction : countries[0].direction;
                    this.$state.configs = configsData ? {
                        ...configsData
                    } : {
                        country: countries[0]
                    }
                    this.$state.configs.languageData = newLanguageData.default;
                });

        },
        loadLanguageData() {
            import(`../assets/languages/${countries[0].lang}.json`)
                .then(newLanguageData => {
                    this.$state.configs = {
                        country: countries[0],
                        languageData: newLanguageData.default
                    }
                });
        },
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
                // color: list.color,
                createdAtDate: new Date().toISOString(),
                tasks: [],
                title: list.title
            })
            this.saveTasks();
        },
        deleteList(listId) {
            const listIndex = this.$state.lists.findIndex(list => list.id == listId);
            this.$state.lists.splice(listIndex, 1);
            this.saveTasks();
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
            this.saveTasks();
        },
        updateTask(listId, taskId, taskKey, taskValue) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            task[taskKey] = taskValue;
        },
        deleteTask(listId, taskId) {
            const list = this.getListById(listId);
            const taskIndex = list.tasks.findIndex(task => task.id == taskId);
            list.tasks.splice(taskIndex, 1);
            this.saveTasks();
        },
        changeTaskStatus(listId, taskId, status) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            task.completed = status;
            this.saveTasks();
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
            this.saveTasks();
        },
        deleteStep(listId, taskId, stepId) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const stepIndex = task.steps.findIndex(step => step.id == stepId);
            task.steps.splice(stepIndex, 1);
            this.saveTasks();
        },
        changeStepStatus(listId, taskId, stepId, status) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const step = this.getStepById(task, stepId);
            step.completed = status;
            this.saveTasks();
        },
        saveTasks() {
            saveTasksData(this.$state.lists);
        },
        loadTasks() {
            this.$state.lists = loadTasksData();
        },
        duplicateList(listId) {
            const list = this.getListById(listId);
            const newList = {
                ...list,
                id: Math.ceil(Math.random() * 1000)
            }
            this.$state.lists.push(newList);
            this.saveTasks();
        },
        renameList(listId, listName) {
            const list = this.getListById(listId);
            list.title = listName;
            this.saveTasks();
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