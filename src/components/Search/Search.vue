<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <div class="flex items-center justify-between w-100">
                    <v-icon @click="goBack" size="large" color="black"
                        :icon="!isRTL ? 'mdi-arrow-left' : 'mdi-arrow-right'"></v-icon>
                    <div class="w-5/6">
                        <v-text-field clearable :value="searchPhrase" @input="searchChangeHandler"
                            :placeholder="tasksListsStore.translate('pages.search.searchForTasks')"
                            variant="plain"></v-text-field>
                    </div>
                    <div></div>
                </div>
            </div>
        </template>

        <template #main>
            <ul class="list-none">
                <li class="px-3 py-2 border-b-2 border-cyan-950 hover:cursor-pointer" v-for="task in searchedTasks"
                    :key="task.id" @click="goToTaskPage(task.id)">
                    <p>{{ task.title }}</p>
                </li>
            </ul>
        </template>
    </Layout>
</template>

<script>
import Layout from '../UI/Layout/Layout.vue';
import { useTasksStore } from '../../store/tasks';

export default {
    components: {
        Layout
    },
    data() {
        return {
            searchPhrase: '',
            tasksListsStore: useTasksStore(),
            searchedTasks: []
        }
    },
    methods: {
        searchChangeHandler(event) {
            this.searchPhrase = event.target.value;
            this.searchedTasks = this.tasksListsStore.searchTasks(event.target.value);
        },
        goToTaskPage(taskId) {
            let currentList = '';
            for (const list of this.tasksListsStore.lists) {
                const taskIds = list.tasks.map(ts => ts.id);
                if (taskIds.includes(taskId)) {
                    currentList = list;
                }
            }
            this.$router.push({ name: 'task', params: { taskId, listId: currentList.id } });
        },
        goBack() {
            this.$router.go(-1);
        }
    },
    computed: {
        isRTL() {
            return this.tasksListsStore.configs.country.direction === 'rtl';
        }
    }
}
</script>