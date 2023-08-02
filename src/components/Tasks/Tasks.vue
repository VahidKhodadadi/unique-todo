<template>
    <Layout>
        <template #header>
            <div class="header">
                <div class="header-content">
                    <ArrowLeftIcon class="icon" @click="goBack" />
                    <h1>{{ listName }}</h1>
                </div>

                <Popover>
                    <template #handle>
                        <MoreIcon class="icon" />
                    </template>

                    <template #combobox>
                        <ul class="drop-list">
                            <li class="drop-item">Sort by</li>
                            <li class="drop-item" @click="copyList">Send a copy</li>
                            <li class="drop-item" @click="duplicateList">Duplicate list</li>
                            <li class="drop-item" @click="showRenameModal = true">Rename list</li>
                            <li class="drop-item" @click="deleteList">Delete list</li>
                            <li class="drop-item">Change theme</li>
                        </ul>
                    </template>
                </Popover>
            </div>
        </template>

        <template #main>
            <p v-if="tasks.length == 0">No task added yet, add one!</p>
            <ul class="tasks" v-if="tasks.length > 0">
                <li v-for="task in tasks" class="task" @click="goToTaskPage(task.id)">
                    <input type="radio" :checked="task.completed"
                        @click.stop="changeTaskStatus(task.id, !task.completed)" />

                    <div class="task-content">
                        <h2>{{ task.title }}</h2>
                        <span>{{ task.steps.filter(step => step.completed === true).length }} of {{ task.steps.length
                        }}</span>
                    </div>
                </li>
            </ul>

            <Modal v-if="this.showRenameModal === true">
                <template #main>
                    <div class="rename-list">
                        <h3 class="rename-header">Rename list</h3>
                        <input type="text" v-model="listTitle" />

                        <div class="action-buttons">
                            <button @click="renameList">rename</button>
                            <button @click="this.showRenameModal = false" class="text-button">cancel</button>
                        </div>
                    </div>
                </template>
            </Modal>
        </template>

        <template #footer>
            <button class="text-button" @click="goToNewTaskPage(listId)">
                <AddIcon class="icon" />
                Add task
            </button>
        </template>
    </Layout>
</template>

<script>
import Layout from '../UI/Layout/Layout.vue';
import { useTasksStore } from '../../store/tasks';
import AddIcon from '../../assets/svg/AddIcon.vue';
import ArrowLeftIcon from '../../assets/svg/ArrowLeftIcon.vue';
import Popover from '../UI/Popover/Popover.vue';
import Modal from '../UI/Modal/Modal.vue';
import MoreIcon from '../../assets/svg/MoreIcon.vue';

export default {
    components: {
        Layout,
        AddIcon,
        ArrowLeftIcon,
        Popover,
        Modal,
        MoreIcon
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            showRenameModal: false,
            listTitle: ''
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
        }
    },
    mounted() {
        this.listTitle = this.listName;
    }
}
</script>

<style scoped>
.tasks {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.task {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 10px 0;
    border-bottom: 1px solid #e2e2e2;
}

.task:hover {
    cursor: pointer;
}

.task-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-left: 20px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.header-content {
    display: flex;
    align-items: center;
}

.action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 20px;
    width: 100%;
}

.rename-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.rename-header {
    margin-bottom: 20px;
}
</style>