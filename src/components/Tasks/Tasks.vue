<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black"
                    :icon="!isRTL ? 'mdi-arrow-left' : 'mdi-arrow-right'"></v-icon>
                <h1 class="text-white text-2xl">{{ listName }}</h1>

                <v-dialog width="auto">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="large" color="black" icon="mdi-dots-vertical"></v-icon>
                    </template>
                    <v-card>
                        <v-card-text>
                            <ul class="flex flex-col">
                                <!-- <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">{{
                                    tasksListsStore.translate('pages.tasks.sortBy') }}</li> -->
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                    @click="copyList">
                                    <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                        icon="mdi-content-copy"></v-icon>
                                    <p>{{ tasksListsStore.translate('pages.tasks.copyList') }}</p>
                                </li>
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                    @click="duplicateList">
                                    <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                        icon="mdi-content-duplicate"></v-icon>
                                    <p>{{ tasksListsStore.translate('pages.tasks.duplicateList') }}</p>
                                </li>

                                <v-dialog width="auto">
                                    <template v-slot:activator="{ props }">
                                        <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                            v-bind="props">
                                            <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                                icon="mdi-rename"></v-icon>
                                            <p>{{ tasksListsStore.translate('pages.tasks.renameList') }}</p>
                                        </li>
                                    </template>

                                    <v-card>
                                        <v-card-text>
                                            <div class="flex flex-col items-center justify-start">
                                                <h3 class="mb-2">{{ tasksListsStore.translate('pages.tasks.renameList') }}
                                                </h3>
                                                <v-text-field class="w-100" v-model="listTitle" :rules="[rules.required]"
                                                    :label="tasksListsStore.translate('pages.tasks.renameList')"></v-text-field>
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <div class="flex items-center justify-evenly mt-2 w-100">
                                                <!-- <v-btn color="blue-grey-darken-3" @click="showRenameModal = false"
                                                    size="large" variant="text">{{ tasksListsStore.translate('app.cancel')
                                                    }}</v-btn> -->
                                                <v-btn variant="elevated" color="blue-grey-darken-3" @click="renameList"
                                                    size="large">{{
                                                        tasksListsStore.translate('app.save') }}</v-btn>
                                            </div>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8 flex items-center"
                                    @click="deleteList">
                                    <v-icon :class="isRTL ? 'ml-3' : 'mr-3'" size="large" color="black"
                                        icon="mdi-trash-can-outline"></v-icon>
                                    <p>{{ tasksListsStore.translate('pages.tasks.deleteList') }}</p>
                                </li>
                            </ul>
                        </v-card-text>
                        <!-- <v-card-actions>
                            <v-btn color="primary" block @click.prevent="showListOptions = false">{{
                                tasksListsStore.translate('app.close') }}</v-btn>
                        </v-card-actions> -->
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <template #main>
            <p v-if="tasks.length == 0" class="text-center">{{ tasksListsStore.translate('pages.tasks.noTask') }}</p>
            <ul class="flex flex-col items-start" v-if="tasks.length > 0">
                <li v-for="task in tasks"
                    class="flex w-100 justify-between py-2 border-b-2 border-l-blue-950 hover:cursor-pointer hover:bg-slate-50"
                    @click="goToTaskPage(task.id)">
                    <div class="flex flex-col justify-between items-start ml-2">
                        <div class="flex justify-start items-center">
                            <v-icon v-if="isTaskDueDated(task)" size="large" color="orange" icon="mdi-alert"></v-icon>
                            <p class="text-slate-800 font-semibold">{{ task.title }}</p>
                        </div>
                        <span v-if="Boolean(task)">{{ task.steps.filter(step => step.completed ===
                            true).length }} {{ tasksListsStore.translate('pages.tasks.of') }} {{ task.steps.length }}</span>
                    </div>

                    <div>
                        <v-checkbox v-model="task.completed" @click.stop="changeTaskStatus(task.id, !task.completed)"
                            hide-details></v-checkbox>
                    </div>
                </li>
            </ul>

            <v-snackbar v-model="showCopySnack">
                {{ tasksListsStore.translate('app.listCopied') }}
                <template v-slot:actions>
                    <v-btn color="pink" variant="text" @click="showCopySnack = false">
                        {{ tasksListsStore.translate('app.close') }}
                    </v-btn>
                </template>
            </v-snackbar>
        </template>

        <template #footer>
            <v-btn class="w-full sm:w-auto" @click="goToNewTaskPage(listId)" size="large" variant="text"
                prepend-icon="mdi-plus">{{ tasksListsStore.translate('pages.tasks.newTask') }}</v-btn>
        </template>
    </Layout>
</template>

<script>
import Layout from '../UI/Layout/Layout.vue';
import { useTasksStore } from '../../store/tasks';
import { isTaskDueDated } from '../../utilities/helpers';

export default {
    components: {
        Layout
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            showCopySnack: false,
            listTitle: '',
            rules: {
                required: value => !!value || this.tasksListsStore.translate('validations.required'),
            },
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        },
        listName() {
            return this.tasksListsStore.lists.find(list => list.id == this.listId)?.title || '';
        },
        tasks() {
            return this.tasksListsStore.lists.find(list => list.id == this.listId)?.tasks || [];
        },
        isRTL() {
            return this.tasksListsStore.configs.country.direction === 'rtl';
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        goToTaskPage(taskId) {
            // this.$router.push({ path: `/task/${this.listId}/${taskId}`, params: { taskId, listId: this.listId } });
            this.$router.push({ name: 'task', params: { taskId, listId: this.listId } });
        },
        goToNewTaskPage(listId) {
            this.$router.push({ name: 'new-task', state: { listId } });
        },
        changeTaskStatus(taskId, status) {
            this.tasksListsStore.changeTaskStatus(this.listId, taskId, status);
        },
        deleteList() {
            this.tasksListsStore.deleteList(this.listId);
            this.$router.replace('/');
        },
        duplicateList() {
            this.tasksListsStore.duplicateList(this.listId);
            this.$router.push('/');
        },
        renameList() {
            if (this.listTitle.trim() === '') {
                // console.error('Error! Enter a valid title!');
                return;
            }
            this.tasksListsStore.renameList(this.listId, this.listTitle);
        },
        copyList() {
            this.tasksListsStore.copyList(this.listId);
            this.showCopySnack = true;
        },
        isTaskDueDated
    },
    mounted() {
        this.listTitle = this.listName;
    }
}
</script>