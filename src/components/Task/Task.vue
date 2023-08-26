<template>
    <Layout>
        <template #header>
            <div class="header">
                <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
                <h1 class="list-title">{{ list.title }}</h1>
                <div></div>
            </div>
        </template>

        <template #main>
            <div class="task">
                <div class="task-status">
                    <!-- <input type="radio" :checked="Boolean(task.completed)" @click="changeTaskStatus(!task.completed)" /> -->
                    <v-checkbox v-model="task.completed" @click="changeTaskStatus(!task.completed)"></v-checkbox>
                    <h2 class="task-title">{{ task.title }}</h2>
                    <div v-if="isTaskDueDated(task)">(Due dated)</div>

                    <Popover>
                        <template #handle>
                            <MoreIcon class="icon" />
                        </template>

                        <template #combobox>
                            <ul class="drop-list">
                                <li class="drop-item">Remind me</li>
                                <li class="drop-item">Repeat</li>
                                <li class="drop-item">Add due date</li>
                                <li class="drop-item">Add file</li>
                            </ul>
                        </template>
                    </Popover>
                </div>

                <ul class="steps">
                    <li v-if="Boolean(task)" v-for="step in task.steps" class="step" :key="step.id">
                        <div class="step-content">
                            <!-- <input type="radio" :checked="step.completed"
                                @click="changeStepStatus(step.id, !step.completed)" /> -->
                            <v-checkbox v-model="step.completed"
                                @click="changeStepStatus(step.id, !step.completed)"></v-checkbox>
                            <p class="step-title">{{ step.title }}</p>
                        </div>

                        <Popover>
                            <template #handle>
                                <MoreIcon class="icon" />
                            </template>

                            <template #combobox>
                                <ul class="drop-list">
                                    <li @click="promoteToTask(step.id)" class="drop-item">Promote to task</li>
                                    <li @click="deleteStep(step.id)" class="drop-item">Delete step</li>
                                </ul>
                            </template>
                        </Popover>
                    </li>
                </ul>
                <div class="new-step-info">
                    <!-- <input placeholder="new step" type="text" v-model="newStepTitle" /> -->
                    <v-text-field class="w-100" v-model="newStepTitle" clearable placeholder="new step"></v-text-field>

                    <!-- <button class="text-button" @click="addNewStep()">
                        <AddIcon class="icon" />
                        Next step
                    </button> -->
                    <v-btn @click="addNewStep()" size="large" variant="text" prepend-icon="mdi-plus">Next step</v-btn>
                    <!-- <textarea class="note-input" placeholder="Add note"></textarea> -->
                </div>
            </div>
        </template>

        <template #footer>
            <div class="footer">
                <p>{{ createdAtRelativeTime() }}</p>
                <v-icon @click="deleteTask" size="large" color="red" icon="mdi-delete-outline"></v-icon>
            </div>
        </template>
    </Layout>
</template>

<script>
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';
import AddIcon from '../../assets/svg/AddIcon.vue';
import MoreIcon from '../../assets/svg/MoreIcon.vue';
import Popover from '../UI/Popover/Popover.vue';
import { isTaskDueDated } from '../../utilities/helpers';

export default {
    components: {
        Layout,
        AddIcon,
        MoreIcon,
        Popover
    },
    props: ['taskId', 'listId'],
    data() {
        return {
            newStepTitle: '',
            tasksStore: useTasksStore()
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
            const rtf1 = new Intl.RelativeTimeFormat('fa', { style: 'short' });
            return rtf1.format(-(roundedDayDiff), 'day');
        }
    }
}
</script>

<style scoped>
.list-title {
    margin-left: 10px;
}

.task-title {
    margin-left: 10px;
    margin-right: auto;
}

.title {
    margin-left: 10px;
}

.task {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.steps {
    list-style: none;
    width: 100%;
    margin-bottom: 20px;
    padding: 0 20px;
}

.step {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.step-title {
    margin-left: 10px;
    font-size: 1.6rem;
    border-bottom: 1px solid #e2e2e2;
    width: 100%;
    padding: 10px 0;
}

.step-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.task-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}


.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.new-step-info {
    padding: 0 20px;
    width: 100%;
}
</style>