<template>
    <Layout>
        <template #header>
            <ArrowLeftIcon class="icon" @click="goBack" />
        </template>

        <template #main>
            <div class="new-task">
                <input type="text" placeholder="Enter task title" v-model="taskTitle" />
                <button @click="addTask">CREATE TASK</button>
            </div>
        </template>
    </Layout>
</template>

<script>
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';
import ArrowLeftIcon from '../../assets/svg/ArrowLeftIcon.vue';

export default {
    components: {
        Layout,
        ArrowLeftIcon
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            taskTitle: '',
            taskDueDate: '',
            taskRemindMeAtDate: ''
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        addTask() {
            this.tasksListsStore.addTask(this.listId, {
                title: this.taskTitle,
                dueDate: this.taskDueDate,
                remindMeAtDate: this.taskRemindMeAtDate
            });
            this.goBack();
        }
    },
    computed: {
        listId() {
            return this.$router.options.history.state.listId;
        }
    }
}
</script>

<style scoped>
.new-task {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}
</style>