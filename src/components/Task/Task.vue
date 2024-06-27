<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black"
                    :icon="!isRTL ? 'mdi-arrow-left' : 'mdi-arrow-right'"></v-icon>
                <h1 class="heading">{{ list.title }}</h1>
                <div></div>
            </div>
        </template>

        <template #main>
            <div class="flex flex-col items-start">
                <div class="flex items-center justify-between w-100">
                    <div class="flex justify-start items-center">
                        <v-checkbox hide-details v-model="task.completed"
                            @click="changeTaskStatus(!task.completed)"></v-checkbox>
                        <div v-if="isTaskDueDated(task)"><v-icon v-if="isTaskDueDated(task)" size="large" color="orange"
                                icon="mdi-alert"></v-icon></div>
                        <p class="mx-3 text-slate-800 font-semibold">{{ task.title }}</p>
                    </div>

                    <v-dialog width="auto">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="large" color="black" icon="mdi-dots-vertical"></v-icon>
                        </template>
                        <v-card>
                            <v-card-text>
                                <ul class="flex flex-col">
                                    <v-dialog width="auto">
                                        <template v-slot:activator="{ props }">
                                            <li v-bind="props"
                                                class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center">
                                                <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                    icon="mdi-alarm-snooze"></v-icon>
                                                <p>{{ tasksListsStore.translate('pages.task.remindMe') }}</p>
                                            </li>
                                        </template>

                                        <v-card>
                                            <v-card-text>
                                                <div class="flex flex-col items-center justify-start">
                                                    <h3 class="mb-2">{{ tasksListsStore.translate('pages.task.remindMeAt')
                                                    }}
                                                    </h3>
                                                    <v-text-field class="w-100" type="datetime-local"
                                                        v-model="remindMeDateTime" clearable
                                                        :label="tasksListsStore.translate('pages.task.remindMeAt')"></v-text-field>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <div class="flex items-center justify-evenly mt-2 w-100">
                                                    <!-- <v-btn color="blue-grey-darken-3"
                                                        size="large" variant="text">{{
                                                            tasksListsStore.translate('app.cancel')
                                                        }}</v-btn> -->
                                                    <v-btn variant="elevated" color="blue-grey-darken-3"
                                                        @click="setTaskRemindDateTime" size="large">{{
                                                            tasksListsStore.translate('app.save') }}</v-btn>
                                                </div>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <v-dialog width="auto">
                                        <template v-slot:activator="{ props }">
                                            <li v-bind="props"
                                                class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center">
                                                <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                    icon="mdi-calendar-clock"></v-icon>
                                                <p>{{ tasksListsStore.translate('pages.task.addDueDate') }}</p>
                                            </li>
                                        </template>

                                        <v-card>
                                            <v-card-text>
                                                <div class="flex flex-col items-center justify-start">
                                                    <h3 class="mb-2">{{ tasksListsStore.translate('pages.task.dueDate')
                                                    }}
                                                    </h3>
                                                    <v-text-field class="w-100" type="datetime-local" v-model="dueDate"
                                                        clearable
                                                        :label="tasksListsStore.translate('pages.task.dueDate')"></v-text-field>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <div class="flex items-center justify-evenly mt-2 w-100">
                                                    <!-- <v-btn color="blue-grey-darken-3"
                                                        size="large" variant="text">{{
                                                            tasksListsStore.translate('app.cancel')
                                                        }}</v-btn> -->
                                                    <v-btn variant="elevated" color="blue-grey-darken-3"
                                                        @click="setTaskDueDate" size="large">{{
                                                            tasksListsStore.translate('app.save') }}</v-btn>
                                                </div>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <v-dialog width="100%" v-model="showRenameTaskDialog">
                                        <template v-slot:activator="{ props }">
                                            <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                                v-bind="props">
                                                <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                    icon="mdi-rename"></v-icon>
                                                <p>{{ tasksListsStore.translate('pages.task.renameTask') }}</p>
                                            </li>
                                        </template>

                                        <v-card>
                                            <v-card-text>
                                                <div class="flex flex-col items-center justify-start">
                                                    <h3 class="mb-2">{{ tasksListsStore.translate('pages.task.renameTask')
                                                    }}
                                                    </h3>
                                                    <v-text-field class="w-100" v-model="taskTitle"
                                                        :rules="[rules.required]"
                                                        :label="tasksListsStore.translate('pages.task.taskName')"></v-text-field>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <div class="flex items-center justify-evenly mt-2 w-100">
                                                    <!-- <v-btn color="blue-grey-darken-3"
                                                        size="large" variant="text">{{
                                                            tasksListsStore.translate('app.cancel')
                                                        }}</v-btn> -->
                                                    <v-btn variant="elevated" color="blue-grey-darken-3" @click="renameTask"
                                                        size="large">{{
                                                            tasksListsStore.translate('app.save') }}</v-btn>
                                                </div>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>

                                    <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                        @click="deleteTask">
                                        <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                            icon="mdi-trash-can-outline"></v-icon>
                                        <p>{{ tasksListsStore.translate('pages.task.deleteTask') }}</p>
                                    </li>
                                    <!-- <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">{{
                                        tasksListsStore.translate('pages.task.repeat') }}</li> -->
                                    <!-- <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">{{
                                        tasksListsStore.translate('pages.task.addDueDate') }}</li> -->
                                    <!-- <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">{{
                                        tasksListsStore.translate('pages.task.addFile') }}</li> -->
                                </ul>
                            </v-card-text>
                            <!-- <v-card-actions>
                                <v-btn color="primary" block @click="showTaskOptions = false">{{
                                    tasksListsStore.translate('app.close') }}</v-btn>
                            </v-card-actions> -->
                        </v-card>
                    </v-dialog>
                </div>

                <ul class="list-none w-100 mb-3 px-3 bg-slate-200">
                    <li v-for="step in task.steps" class="flex items-center justify-between w-100" :key="step.id">
                        <div class="flex items-center justify-start w-100">
                            <v-checkbox v-model="step.completed" hide-details
                                @click="changeStepStatus(step.id, !step.completed)"></v-checkbox>
                            <p class="py-3 w-100 mx-3">{{ step.title }}</p>
                        </div>

                        <v-dialog width="auto">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="large" color="black"
                                    icon="mdi-dots-vertical"></v-icon>
                            </template>
                            <v-card>
                                <v-card-text>
                                    <ul class="flex flex-col">
                                        <li @click="promoteToTask(step.id)"
                                            class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center">
                                            <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                icon="mdi-arrow-top-left"></v-icon>
                                            <p>{{ tasksListsStore.translate('pages.task.promoteToTask') }}</p>
                                        </li>
                                        <li @click="deleteStep(step.id)"
                                            class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center">
                                            <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                icon="mdi-trash-can-outline"></v-icon>
                                            <p>{{ tasksListsStore.translate('pages.task.deleteStep') }}</p>
                                        </li>
                                    </ul>
                                </v-card-text>
                                <!-- <v-card-actions>
                                    <v-btn color="primary" block @click="showStepOptions = false">{{
                                        tasksListsStore.translate('app.close') }}</v-btn>
                                </v-card-actions> -->
                            </v-card>
                        </v-dialog>
                    </li>
                </ul>

                <v-form validate-on="submit" @submit.prevent="addNewStep()" class="w-100 px-3 flex flex-col items-center">
                    <v-text-field class="w-100" v-model="newStepTitle" clearable :rules="[rules.required]"
                        :placeholder="tasksListsStore.translate('pages.task.enterStepTitle')"></v-text-field>
                    <v-btn class="w-full sm:w-auto" color="blue-grey-darken-3" type="submit" size="large"
                        prepend-icon="mdi-plus">{{ tasksListsStore.translate('pages.task.addStep') }}</v-btn>
                </v-form>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-between items-center w-100">
                <p class="text-sm"><span class="text-sm text-slate-400">{{ tasksListsStore.translate('app.createdAt') }}</span> {{
                    createdAtRelativeTime() }}</p>
                <!-- <v-icon @click="deleteTask" size="large" color="red" icon="mdi-delete-outline"></v-icon> -->
            </div>
        </template>
    </Layout>
</template>

<script>
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';
import { isTaskDueDated } from '../../utilities/helpers';

export default {
    components: {
        Layout
    },
    props: ['taskId', 'listId'],
    data() {
        return {
            newStepTitle: '',
            tasksListsStore: useTasksStore(),
            taskTitle: '',
            remindMeDateTime: '',
            dueDate: '',
            rules: {
                required: value => !!value || this.tasksListsStore.translate('validations.required'),
            },
            showRenameTaskDialog: false
        }
    },
    computed: {
        list() {
            return this.tasksListsStore.lists.find(list => list.id == this.$props.listId);
        },
        task() {
            return this.list.tasks.find(ts => ts.id == this.$props.taskId);
        },
        isRTL() {
            return this.tasksListsStore.configs.country.direction === 'rtl';
        }
    },
    methods: {
        addNewStep() {
            if (this.newStepTitle.trim() === '') {
                // console.error(this.tasksListsStore.translate('validations.required'));
                return;
            }
            this.tasksListsStore.addStep(this.$props.listId, this.$props.taskId, this.newStepTitle);
            this.newStepTitle = '';
        },
        goBack() {
            this.$router.go(-1);
        },
        deleteTask() {
            this.$router.replace(`/tasks/${this.$props.listId}`);
            this.tasksListsStore.deleteTask(this.$props.listId, this.$props.taskId);
            // this.$router.push({ path: `/tasks/${this.$props.listId}`, params: { listId: this.$props.listId } });
        },
        deleteStep(stepId) {
            this.tasksListsStore.deleteStep(this.$props.listId, this.$props.taskId, stepId);
        },
        changeTaskStatus(status) {
            this.tasksListsStore.changeTaskStatus(this.$props.listId, this.$props.taskId, status);
        },
        changeStepStatus(stepId, status) {
            this.tasksListsStore.changeStepStatus(this.$props.listId, this.$props.taskId, stepId, status);
        },
        promoteToTask(stepId) {
            this.tasksListsStore.convertStepToTask(this.$props.listId, this.$props.taskId, stepId);
        },
        isTaskDueDated,
        createdAtRelativeTime() {
            const createdAtDate = new Date(this.task.createdAtDate);
            const today = new Date();
            const timestampDiff = today.getTime() - createdAtDate.getTime();
            const dayDiff = timestampDiff / 1000 / 60 / 60 / 24;
            const roundedDayDiff = Math.floor(dayDiff);
            const lang = this.tasksListsStore.configs.country.lang;
            const rtf1 = new Intl.RelativeTimeFormat(lang, { style: 'short' });
            if (roundedDayDiff == 0) {
                return this.tasksListsStore.translate('app.today');
            }
            else {
                return rtf1.format(-(roundedDayDiff), 'day');
            }
        },
        setTaskRemindDateTime() {
            this.tasksListsStore.updateTask(this.listId, this.taskId, 'remindMeAtDateTime', this.remindMeDateTime);
            this.remindMeDateTime = '';
        },
        setTaskDueDate() {
            this.tasksListsStore.updateTask(this.listId, this.taskId, 'dueDate', this.dueDate);
            this.dueDate = '';
        },
        renameTask() {
            this.tasksListsStore.renameTask(this.$props.listId, this.$props.taskId, this.taskTitle);
            this.showRenameTaskDialog = false;
        }
    },
    mounted() {
        this.taskTitle = this.task.title;
    }
}
</script>