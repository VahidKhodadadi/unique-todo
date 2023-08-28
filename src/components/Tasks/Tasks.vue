<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
                <h1>{{ listName }}</h1>

                <v-dialog v-model="showListOptions" width="auto">
                    <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="large" color="black" icon="mdi-dots-vertical"></v-icon>
                    </template>
                    <v-card>
                        <v-card-text>
                            <ul class="flex flex-col">
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Sort by</li>
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8" @click="copyList">Send a copy
                                </li>
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8" @click="duplicateList">
                                    Duplicate list</li>

                                <v-dialog v-model="showRenameModal" width="auto">
                                    <template v-slot:activator="{ props }">
                                        <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8" v-bind="props">Rename
                                            list</li>
                                    </template>

                                    <v-card>
                                        <v-card-text>
                                            <div class="flex flex-col items-center justify-start">
                                                <h3 class="mb-2">Rename list</h3>
                                                <v-text-field class="w-100" v-model="listTitle" :rules="[rules.required]"
                                                    clearable label="Rename list"></v-text-field>
                                            </div>
                                        </v-card-text>
                                        <v-card-actions>
                                            <div class="flex items-center justify-evenly mt-2 w-100">
                                                <v-btn color="blue-grey-darken-3" @click="showRenameModal = false"
                                                    size="large" variant="text">Cancel</v-btn>
                                                <v-btn color="blue-grey-darken-3" @click="renameList"
                                                    size="large">Save</v-btn>
                                            </div>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>

                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8" @click="deleteList">Delete list
                                </li>
                                <li class="w-100 hover:cursor-pointer hover:bg-slate-50 h-8">Change theme</li>
                            </ul>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" block @click="showListOptions = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
        </template>

        <template #main>
            <p v-if="tasks.length == 0">No task added yet, add one!</p>
            <ul class="flex flex-col items-start" v-if="tasks.length > 0">
                <li v-for="task in tasks"
                    class="flex w-100 justify-between py-2 border-b-2 border-l-blue-950 hover:cursor-pointer hover:bg-slate-50"
                    @click="goToTaskPage(task.id)">
                    <v-checkbox v-model="task.completed" @click.stop="changeTaskStatus(task.id, !task.completed)"
                        hide-details="true"></v-checkbox>

                    <div class="flex flex-col justify-start items-start ml-2">
                        <p class="text-slate-800 font-semibold">{{ task.title }}</p>
                        <span class="ml-auto" v-if="Boolean(task)">{{ task.steps.filter(step => step.completed ===
                            true).length }} of {{ task.steps.length }}</span>
                    </div>

                    <div v-if="isTaskDueDated(task)">
                        (Due dated)
                    </div>
                </li>
            </ul>
        </template>

        <template #footer>
            <v-btn @click="goToNewTaskPage(listId)" size="large" variant="text" prepend-icon="mdi-plus">Add task</v-btn>
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
            showRenameModal: false,
            showListOptions: false,
            listTitle: '',
            rules: {
                required: value => !!value || 'Field is required',
            },
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        },
        listName() {
            return this.tasksListsStore.$state.lists.find(list => list.id == this.listId).title;
        },
        tasks() {
            return this.tasksListsStore.$state.lists.find(list => list.id == this.listId).tasks;
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
        },
        duplicateList() {
            this.tasksListsStore.duplicateList(this.listId);
            this.$router.push('/');
        },
        renameList() {
            if (this.listTitle.trim() === '') {
                console.error('Error! Enter a valid title!');
                return;
            }
            this.tasksListsStore.renameList(this.listId, this.listTitle);
            this.showRenameModal = false;
        },
        copyList() {
            this.tasksListsStore.copyList(this.listId);
        },
        isTaskDueDated
    },
    mounted() {
        this.listTitle = this.listName;
    }
}
</script>