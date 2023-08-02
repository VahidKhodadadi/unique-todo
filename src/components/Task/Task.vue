<template>
    <Layout>
        <template #header>
            <div class="header">
                <ArrowLeftIcon class="icon" @click="goBack" />
                <h1 class="list-title">{{ list?.title || '' }}</h1>
            </div>
        </template>

        <template #main>
            <div class="task">
                <div class="task-status">
                    <input type="radio" :checked="task?.completed || false" @click="changeTaskStatus(!task.completed)" />
                    <h2 class="task-title">{{ task?.title || '' }}</h2>

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
                            <input type="radio" :checked="step.completed"
                                @click="changeStepStatus(step.id, !step.completed)" />
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
                    <input placeholder="new step" type="text" v-model="newStepTitle" />
                    <button class="text-button" @click="addNewStep()">
                        <AddIcon class="icon" />
                        Next step
                    </button>
                    <textarea class="note-input" placeholder="Add note"></textarea>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="footer">
                <p>Created 3 hours ago</p>
                <TrashIcon @click="deleteTask" class="icon" />
            </div>
        </template>
    </Layout>
</template>

<script>
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';
import AddIcon from '../../assets/svg/AddIcon.vue';
import ArrowLeftIcon from '../../assets/svg/ArrowLeftIcon.vue';
import TrashIcon from '../../assets/svg/TrashIcon.vue';
import MoreIcon from '../../assets/svg/MoreIcon.vue';
import Popover from '../UI/Popover/Popover.vue';

export default {
    components: {
        Layout,
        AddIcon,
        ArrowLeftIcon,
        TrashIcon,
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
    align-content: center;
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