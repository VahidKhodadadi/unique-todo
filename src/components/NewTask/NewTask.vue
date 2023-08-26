<template>
    <Layout>
        <template #header>
            <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
            <h1>New task</h1>
            <div></div>
        </template>

        <template #main>
            <div class="new-task">
                <v-text-field class="w-100" v-model="taskTitle" :rules="[rules.required]" clearable
                    label="Enter task title"></v-text-field>

                <v-text-field class="w-100" type="datetime-local" v-model="taskDueDate" clearable
                    label="Due date"></v-text-field>

                <v-text-field class="w-100" type="datetime-local" v-model="taskRemindMeAtDateTime" clearable
                    label="Remind me at"></v-text-field>

                <v-btn color="blue-grey-darken-3" @click="addTask" size="large">Create task</v-btn>
            </div>
        </template>
    </Layout>
</template>

<script>
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';

export default {
    components: {
        Layout
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            taskTitle: '',
            taskDueDate: '',
            taskRemindMeAtDateTime: '',
            rules: {
                required: value => !!value || 'Field is required',
            },
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        addTask() {
            if (this.taskTitle.trim() === '') {
                console.error('Enter a valid title!');
                return;
            }
            this.tasksListsStore.addTask(this.listId, {
                title: this.taskTitle,
                dueDate: this.taskDueDate,
                remindMeAtDateTime: this.taskRemindMeAtDateTime
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
    align-items: center;
}
</style>