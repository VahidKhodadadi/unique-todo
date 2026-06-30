import { defineStore } from 'pinia';
import { copyToClipboard, isTaskDueDated, loadTasksData, notifyUser, saveTasksData, saveConfigs, loadConfigs } from '../utilities/helpers';
import router from '../router';
import IranFlag from '../assets/country-flags/iran.png';
import USAFlag from '../assets/country-flags/united-states-of-america.png';
import { v4 as uuidv4 } from 'uuid';

interface Country {
  name: string;
  shortName: string;
  direction: string;
  language: string;
  lang: string;
  currency: string;
  flag: string;
}

interface TaskStep {
  id: string;
  title: string;
  createdAtDate: string;
  completed: boolean;
}

interface Task {
  id: string;
  completed: boolean;
  createdAtDate: string;
  dueDate: string | null;
  remindMeAtDateTime: string | null;
  steps: TaskStep[];
  title: string;
}

interface List {
  id: string;
  createdAtDate: string;
  tasks: Task[];
  title: string;
}

interface Configs {
  country: Country;
  languageData: any;
}

interface State {
  lists: List[];
  configs: Configs;
}

export const countries: Country[] = [
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
    state: (): State => ({
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
        translate(keyChain: string): string {
            const tempLanguageData = this.$state.configs.languageData;
            if (!tempLanguageData) {
                return '';
            }
            const chainArr = keyChain.split('.');
            const translatedText = chainArr.reduce((previous: any, current: string) => {
                if (!previous[current]) {
                    return [];
                }
                return previous[current];
            }, tempLanguageData);
            return translatedText;
        },
        setLanguageData(newLanguageData: any) {
            this.$state.configs = {
                ...this.$state.configs,
                languageData: newLanguageData
            }
        },
        setConfigKey(key: keyof Configs, value: any) {
            (this.configs as any)[key] = value;
            const { languageData, ...otherConfigs } = {
                ...this.configs,
                [key]: value
            };
            saveConfigs(otherConfigs);
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
                })
                .catch(error => {
                    console.error('Failed to load language data:', error);
                    // Fallback to default language
                    import(`../assets/languages/${countries[0].lang}.json`)
                        .then(fallbackLanguageData => {
                            document.dir = countries[0].direction;
                            this.$state.configs = {
                                country: countries[0],
                                languageData: fallbackLanguageData.default
                            }
                        });
                });

        },
        loadLanguageData() {
            import(`../assets/languages/${countries[0].lang}.json`)
                .then(newLanguageData => {
                    this.$state.configs = {
                        country: countries[0],
                        languageData: newLanguageData.default
                    }
                })
                .catch(error => {
                    console.error('Failed to load default language data:', error);
                });
        },
        getListById(listId: string): List | undefined {
            return this.$state.lists.find(list => list.id == listId);
        },
        getTaskById(list: List, taskId: string): Task | undefined {
            return list.tasks.find(task => task.id == taskId);
        },
        getStepById(task: Task, stepId: string): TaskStep | undefined {
            return task.steps.find(step => step.id == stepId);
        },
        addList(list: { title: string }) {
            this.$state.lists.push({
                id: uuidv4(),
                createdAtDate: new Date().toISOString(),
                tasks: [],
                title: list.title
            })
            this.saveTasks();
        },
        deleteList(listId: string) {
            const listIndex = this.$state.lists.findIndex(list => list.id == listId);
            this.$state.lists.splice(listIndex, 1);
            this.saveTasks();
        },
        addTask(listId: string, task: { title: string; dueDate: string | null; remindMeAtDateTime: string | null }) {
            const list = this.getListById(listId);
            if (list) {
                list.tasks.push({
                    completed: false,
                    createdAtDate: new Date().toISOString(),
                    dueDate: task.dueDate,
                    id: uuidv4(),
                    remindMeAtDateTime: task.remindMeAtDateTime,
                    steps: [],
                    title: task.title
                });
                this.saveTasks();
            }
        },
        updateTask(listId: string, taskId: string, taskKey: string, taskValue: any) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            if (list && task) {
                task[taskKey] = taskValue;
                this.saveTasks();
            }
        },
        deleteTask(listId: string, taskId: string) {
            const list = this.getListById(listId);
            if (list) {
                const taskIndex = list.tasks.findIndex(task => task.id == taskId);
                list.tasks.splice(taskIndex, 1);
                this.saveTasks();
            }
        },
        changeTaskStatus(listId: string, taskId: string, status: boolean) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            if (list && task) {
                task.completed = status;
                this.saveTasks();
            }
        },
        addStep(listId: string, taskId: string, stepTitle: string) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            if (list && task) {
                task.steps.push({
                    id: uuidv4(),
                    title: stepTitle,
                    createdAtDate: new Date().toISOString(),
                    completed: false
                });
                this.saveTasks();
            }
        },
        deleteStep(listId: string, taskId: string, stepId: string) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            if (list && task) {
                const stepIndex = task.steps.findIndex(step => step.id == stepId);
                task.steps.splice(stepIndex, 1);
                this.saveTasks();
            }
        },
        changeStepStatus(listId: string, taskId: string, stepId: string, status: boolean) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const step = this.getStepById(task, stepId);
            if (list && task && step) {
                step.completed = status;
                this.saveTasks();
            }
        },
        saveTasks() {
            saveTasksData(this.$state.lists);
        },
        loadTasks() {
            this.$state.lists = loadTasksData();
        },
        duplicateList(listId: string) {
            const list = this.getListById(listId);
            if (list) {
                const newList = {
                    ...list,
                    id: uuidv4()
                }
                this.$state.lists.push(newList);
                this.saveTasks();
            }
        },
        renameList(listId: string, listName: string) {
            const list = this.getListById(listId);
            if (list) {
                list.title = listName;
                this.saveTasks();
            }
        },
        renameTask(listId: string, taskId: string, taskName: string) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            if (list && task) {
                task.title = taskName;
                this.saveTasks();
            }
        },
        searchTasks(searchPhrase: string): Task[] {
            if (searchPhrase.trim() === '') {
                return [];
            }
            const searchResult: Task[] = [];
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (task.title.includes(searchPhrase)) {
                        searchResult.push(task);
                    }
                }
            }
            return searchResult;
        },
        copyList(listId: string) {
            const list = this.getListById(listId);
            if (list) {
                copyToClipboard(JSON.stringify(list));
            }
        },
        convertStepToTask(listId: string, taskId: string, stepId: string) {
            const list = this.getListById(listId);
            const task = this.getTaskById(list, taskId);
            const step = this.getStepById(task, stepId);
            if (list && task && step) {
                task.steps = task.steps.filter(sp => sp.id != stepId);
                const newTask: Task = {
                    ...step,
                    dueDate: null,
                    remindMeAtDateTime: null,
                    steps: []
                }
                list.tasks.push(newTask);
                this.saveTasks();
            }
        },
        checkForDueDatedTasks() {
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (isTaskDueDated(task.dueDate, task.completed)) {
                        const notification = notifyUser(`Task '${task.title}' deadline is passed. Don't forget to deal with it!`);
                        if (notification) {
                            notification.addEventListener('click', (e) => {
                                router.push(`/task/${list.id}/${task.id}`);
                            });
                        }
                    }
                }
            }
        },
        checkForReminders() {
            for (const list of this.$state.lists) {
                for (const task of list.tasks) {
                    if (isTaskDueDated(task.remindMeAtDateTime, task.completed)) {
                        const notification = notifyUser(`Task '${task.title}' is not completed yet. Don't forget to deal with it!`);
                        if (notification) {
                            notification.addEventListener('click', (e) => {
                                router.push(`/task/${list.id}/${task.id}`);
                            });
                        }
                    }
                }
            }
        }
    }
});