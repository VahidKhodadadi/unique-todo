<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <div></div>
                <h1>Lists</h1>
                <v-icon @click="goToSearchPage" size="large" color="black" icon="mdi-magnify"></v-icon>
            </div>
        </template>
        <template #main>
            <ul class="flex flex-col justify-center items-center w-100">
                <li v-for="list in listItems"
                    class="flex w-100 justify-between py-2 border-b-2 border-l-blue-950 hover:cursor-pointer hover:bg-slate-50"
                    @click="goToTasksPage(list.id)" :key="list.id">
                    <p class="text-slate-800 font-semibold">
                        {{ list.title }}
                        <span>({{ list.tasks.length }})</span>
                    </p>
                    <v-icon @click.stop="deleteList(list.id)" size="large" color="red" icon="mdi-delete-outline"></v-icon>
                </li>
            </ul>
        </template>
        <template #footer>
            <v-btn @click="goToNewListPage" size="large" variant="text" prepend-icon="mdi-plus">New list</v-btn>
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
            taskListsStore: useTasksStore()
        }
    },
    methods: {
        goToNewListPage() {
            this.$router.push('/new-list');
        },
        goToTasksPage(listId) {
            // this.$router.push({ path: `/tasks/${listId}`, params: { listId } });
            this.$router.push({ name: 'tasks', params: { listId } });
        },
        goToSearchPage() {
            this.$router.push('/search');
        },
        deleteList(listId) {
            this.taskListsStore.deleteList(listId);
        }
    },
    computed: {
        listItems() {
            return this.taskListsStore.$state.lists;
        }
    }
}
</script>


<style scoped>
.list {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #e2e2e2;
}

.list:hover {
    cursor: pointer;
}
</style>