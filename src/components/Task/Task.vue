<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
                <h1 class="text-white text-3xl">{{ list.title }}</h1>
                <div></div>
            </div>
        </template>

        <template #main>
            <div class="flex flex-col items-start">
                <div class="flex items-center justify-between w-100">
                    <div class="flex justify-start items-center">
                        <v-checkbox hide-details="true" v-model="task.completed"
                            @click="changeTaskStatus(!task.completed)"></v-checkbox>
                        <div v-if="isTaskDueDated(task)"><v-icon v-if="isTaskDueDated(task)" size="large" color="orange"
                                icon="mdi-alert"></v-icon></div>
                        <p class="mx-3 text-slate-800 font-semibold">{{ task.title }}</p>
                    </div>

                    <v-dialog v-model="showTaskOptions" width="auto">
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" size="large" color="black" icon="mdi-dots-vertical"></v-icon>
                        </template>
                        <v-card>
                            <v-card-text>
                                <ul class="flex flex-col">
                                    <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Remind me</li>
                                    <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Repeat</li>
                                    <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Add due date</li>
                                    <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Add file</li>
                                </ul>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="primary" block @click="showTaskOptions = false">Close</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>

                <ul class="list-none w-100 mb-3 px-3">
                    <li v-if="Boolean(task)" v-for="step in task.steps" class="flex items-center justify-between w-100"
                        :key="step.id">
                        <div class="flex items-center justify-start w-100">
                            <v-checkbox v-model="step.completed" hide-details="true"
                                @click="changeStepStatus(step.id, !step.completed)"></v-checkbox>
                            <p class="py-3 w-100 ml-3">{{ step.title }}</p>
                        </div>

                        <v-dialog v-model="showStepOptions" width="auto">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="large" color="black" icon="mdi-dots-vertical"></v-icon>
                            </template>
                            <v-card>
                                <v-card-text>
                                    <ul class="flex flex-col">
                                        <li @click="promoteToTask(step.id)"
                                            class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Promote to task</li>
                                        <li @click="deleteStep(step.id)"
                                            class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Delete step</li>
                                    </ul>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn color="primary" block @click="showStepOptions = false">Close</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </li>
                </ul>
                <v-form @submit.prevent="addNewStep()" class="w-100 px-3 d-flex flex-col items-center">
                    <v-text-field class="w-100" v-model="newStepTitle" clearable
                        placeholder="Enter new step"></v-text-field>
                    <v-btn class="w-full sm:w-auto" color="blue-grey-darken-3" type="submit" size="large"
                        prepend-icon="mdi-plus">Add step</v-btn>
                </v-form>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-between items-center w-100">
                <p>{{ createdAtRelativeTime() }}</p>
                <v-icon @click="deleteTask" size="large" color="red" icon="mdi-delete-outline"></v-icon>
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
            tasksStore: useTasksStore(),
            showTaskOptions: false,
            showStepOptions: false
        }
    },
    computed: {
        list() {
            return this.tasksStore.$state.lists.find(list => list.id == this.$props.listId);
        },
        task() {
            return this.list.tasks.find(ts => ts.id == this.$props.taskId);
        }
    },
    methods: {
        addNewStep() {
            if (this.newStepTitle.trim() === '') {
                console.error('Enter a valid step title!');
                return;
            }
            this.tasksStore.addStep(this.$props.listId, this.$props.taskId, this.newStepTitle);
            this.newStepTitle = '';
        },
        goBack() {
            this.$router.go(-1);
        },
        deleteTask() {
            this.$router.push('/lists');
            this.tasksStore.deleteTask(this.$props.listId, this.$props.taskId);
            // this.$router.push({ path: `/tasks/${this.$props.listId}`, params: { listId: this.$props.listId } });
        },
        deleteStep(stepId) {
            this.tasksStore.deleteStep(this.$props.listId, this.$props.taskId, stepId);
        },
        changeTaskStatus(status) {
            this.tasksStore.changeTaskStatus(this.$props.listId, this.$props.taskId, status);
        },
        changeStepStatus(stepId, status) {
            this.tasksStore.changeStepStatus(this.$props.listId, this.$props.taskId, stepId, status);
        },
        promoteToTask(stepId) {
            this.tasksStore.convertStepToTask(this.$props.listId, this.$props.taskId, stepId);
        },
        isTaskDueDated,
        createdAtRelativeTime() {
            const createdAtDate = new Date(this.task.createdAtDate);
            const today = new Date();
            const timestampDiff = today.getTime() - createdAtDate.getTime();
            const dayDiff = timestampDiff / 1000 / 60 / 60 / 24;
            const roundedDayDiff = Math.floor(dayDiff);
            const rtf1 = new Intl.RelativeTimeFormat('en', { style: 'short' });
            return roundedDayDiff == 0 ? 'Today' : rtf1.format(-(roundedDayDiff), 'day');
        }
    }
}
</script>