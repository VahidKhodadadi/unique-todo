<template>
    <Layout>
        <template #header>
            <div class="header">
                <p>Account info and search</p>
                <SearchIcon class="icon" @click="goToSearchPage" />
            </div>
        </template>
        <template #main>
            <h1>Lists</h1>
            <ul class="lists">
                <li v-for="list in listItems" class="list" @click="goToTasksPage(list.id)" :key="list.id">
                    <p>
                        {{ list.title }}
                        <span>({{ list.tasks.length }})</span>
                    </p>
                    <TrashIcon fill="#cf2b2e" class="icon" @click.stop="deleteList(list.id)" />
                </li>
            </ul>
        </template>
        <template #footer>
            <button class="text-button" @click="goToNewListPage">
                <AddIcon class="icon" />
                New list
            </button>
        </template>
    </Layout>
</template>

<script>
import Layout from '../UI/Layout/Layout.vue';
import { useTasksStore } from '../../store/tasks';
import TrashIcon from '../../assets/svg/TrashIcon.vue';
import AddIcon from '../../assets/svg/AddIcon.vue';
import SearchIcon from '../../assets/svg/SearchIcon.vue';

export default {
    components: {
        Layout,
        TrashIcon,
        AddIcon,
        SearchIcon
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
            this.$router.push({ path: `/tasks/${listId}`, params: { listId } });
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
    },
    mounted() {
        this.taskListsStore.load();
    }
}
</script>


<style scoped>
.lists {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
}

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

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
</style>