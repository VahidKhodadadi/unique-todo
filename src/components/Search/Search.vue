<template>
    <Layout>
        <template #header>
            <div class="header">
                <div class="search">
                    <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
                    <!-- <input type="text" :value="searchPhrase" @input="searchChangeHandler" /> -->
                    <v-text-field class="w-100" clearable :value="searchPhrase" @input="searchChangeHandler"
                        placeholder="Search for tasks" variant="plain"></v-text-field>
                </div>
            </div>
        </template>

        <template #main>
            <ul class="tasks">
                <li class="task" v-for="task in searchedTasks" :key="task.id" @click="goToTaskPage(task.id)">
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
            tasksStore: useTasksStore(),
            searchedTasks: []
        }
    },
    methods: {
        searchChangeHandler(event) {
            this.searchPhrase = event.target.value;
            this.searchedTasks = this.tasksStore.searchTasks(event.target.value);
        },
        goToTaskPage(taskId) {
            let currentList = '';
            for (const list of this.tasksStore.$state.lists) {
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
    }
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.search {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
}

.tasks {
    list-style: none;
}

.task {
    padding: 10px 5px;
    border-bottom: 1px solid #e2e2e2;
    transition: all 0.3 ease;
}

.task:hover {
    cursor: pointer;
    background-color: #e2e2e2;
}
</style>