<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black"
                    :icon="tasksListsStore.configs.country.direction === 'ltr' ? 'mdi-arrow-left' : 'mdi-arrow-right'"></v-icon>
                <h1 class="text-white text-3xl">{{ tasksListsStore.translate('pages.newTask.newTask') }}</h1>
                <div></div>
            </div>
        </template>

        <template #main>
            <v-form @submit.prevent="addTask" class="flex flex-col items-center">
                <v-text-field class="w-100" v-model="taskTitle" :rules="[rules.required]" clearable
                    :label="tasksListsStore.translate('pages.newTask.enterTaskTitle')"></v-text-field>

                <v-text-field class="w-100" type="datetime-local" v-model="taskDueDate" clearable
                    :label="tasksListsStore.translate('pages.newTask.dueDate')"></v-text-field>

                <v-text-field class="w-100" type="datetime-local" v-model="taskRemindMeAtDateTime" clearable
                    :label="tasksListsStore.translate('pages.newTask.remindMeAt')"></v-text-field>

                <v-btn class="w-full sm:w-auto" color="blue-grey-darken-3" type="submit" size="large">{{
                    tasksListsStore.translate('pages.newTask.addTask') }}</v-btn>
            </v-form>
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
                required: value => !!value || this.tasksListsStore.translate('validations.required'),
            },
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        addTask() {
            if (this.taskTitle.trim() === '') {
                // console.error('Enter a valid title!');
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