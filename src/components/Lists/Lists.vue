<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-full">
                <div></div>
                <h1 class="text-xl font-bold text-gray-800" data-test="heading">{{ tasksListsStore.translate('pages.lists.lists') }}</h1>
                <v-icon @click="goToSearchPage" size="large" color="primary" icon="mdi-magnify" class="cursor-pointer"></v-icon>
            </div>
        </template>
        <template #main>
            <div v-if="listItems.length == 0" class="text-center py-8">
                <p class="text-gray-500">{{ tasksListsStore.translate('pages.lists.noList') }}</p>
                <v-btn @click="goToNewListPage" class="mt-4" color="primary" variant="outlined" prepend-icon="mdi-plus">
                    {{ tasksListsStore.translate('pages.lists.newList') }}
                </v-btn>
            </div>
            <ul v-else class="space-y-2">
                <li v-for="list in listItems"
                    class="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    @click="goToTasksPage(list.id)" :key="list.id">
                    <div class="flex items-center space-x-4">
                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span class="text-blue-600 font-semibold">{{ list.title.charAt(0).toUpperCase() }}</span>
                        </div>
                        <div>
                            <p class="text-gray-800 font-medium">
                                {{ list.title }}
                            </p>
                            <p class="text-sm text-gray-500">
                                {{ list.tasks.length }} {{ list.tasks.length === 1 ? 'task' : 'tasks' }}
                            </p>
                        </div>
                    </div>
                     <v-icon @click.stop="deleteList(list.id)" size="small" color="error" icon="mdi-delete-outline" class="transition-opacity"></v-icon>
                </li>
            </ul>
        </template>
        <template #footer>
            <v-btn class="w-full" @click="goToNewListPage" size="large" color="primary" variant="outlined" prepend-icon="mdi-plus">
                {{ tasksListsStore.translate('pages.lists.newList') }}
            </v-btn>
        </template>
    </Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import Layout from '../UI/Layout/Layout.vue';
import { useTasksStore } from '../../store/tasks';

const router = useRouter();
const tasksListsStore = useTasksStore();

const goToNewListPage = () => {
    router.push('/new-list');
};

const goToTasksPage = (listId: string) => {
    router.push({ name: 'tasks', params: { listId } });
};

const goToSearchPage = () => {
    router.push('/search');
};

const deleteList = (listId: string) => {
    tasksListsStore.deleteList(listId);
};

const listItems = computed(() => {
    return tasksListsStore.lists;
});
</script>