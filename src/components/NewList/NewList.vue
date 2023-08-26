<template>
    <Layout>
        <template #header>
            <v-icon @click="goBack" size="large" color="black" icon="mdi-arrow-left"></v-icon>
            <h1 class="headerTitle">New List</h1>
        </template>

        <template #main>
            <div class="new-list">
                <!-- <input type="text" placeholder="Enter list title" v-model="listTitle" /> -->
                <v-text-field class="w-100" v-model="listTitle" :rules="[rules.required]" clearable
                    label="Enter list title"></v-text-field>

                <ul class="colors">
                    <li @click="selectColor(color)" v-for="color in listColors" :style="{ backgroundColor: color }"
                        class="color" :class="listColor === color ? 'active' : ''">
                    </li>
                </ul>

                <div class="action-buttons">
                    <v-btn color="blue-grey-darken-3" @click="goToTasksListPage" size="large" variant="text">Cancel</v-btn>
                    <v-btn color="blue-grey-darken-3" @click="addList" size="large">Create list</v-btn>
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
            listColor: listColors[1],
            rules: {
                required: value => !!value || 'Field is required',
            },
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
        },
        goBack() {
            this.$router.go(-1);
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
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 20px;
    gap: 4px;
}

.color {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid transparent;
}

.color.active {
    border: 5px solid #5d5c61;
}

.action-buttons {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}
</style>