<template>
    <Layout>
        <template #header>
            <h1>New List</h1>
        </template>

        <template #main>
            <div class="new-list">
                <input type="text" placeholder="Enter list title" v-model="listTitle" />
                <ul class="colors">
                    <li @click="selectColor(color)" v-for="color in listColors"
                        :style="{ backgroundColor: color, outline: listColor === color ? '3px solid blue' : '' }"
                        class="color">
                    </li>
                </ul>

                <div class="action-buttons">
                    <button class="text-button" @click="goToTasksListPage">CANCEL</button>
                    <button @click="addList">CREATE LIST</button>
                </div>
            </div>
        </template>

    </Layout>
</template>

<script>
import { listColors } from '../data/data';
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';

export default {
    components: {
        Layout
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            listColors,
            listTitle: '',
            listColor: '',
        }
    },
    methods: {
        goToTasksListPage() {
            this.$router.push('/lists');
        },
        selectColor(color) {
            this.listColor = color;
        },
        addList() {
            if (this.listTitle.trim() === '') {
                console.error('Enter a valid title!');
                return;
            }
            this.tasksListsStore.addList({ title: this.listTitle, color: this.listColor });
            this.$router.push('/lists');
        }
    }
}
</script>

<style scoped>
.new-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
}

.colors {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
}

.color {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid goldenrod;
}

.action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}
</style>