<template>
    <Layout>
        <template #header>
            <div class="flex flex-row justify-between items-center w-100">
                <v-icon @click="goBack" size="large" color="black"
                    :icon="!isRTL ? 'mdi-arrow-left' : 'mdi-arrow-right'"></v-icon>
                <h1 class="heading">{{ tasksListsStore.translate('pages.newList.newList') }}</h1>
                <div></div>
            </div>
        </template>

        <template #main>
            <v-form validate-on="submit" class="flex flex-col items-start gap-2" @submit.prevent="addList">
                <v-text-field class="w-100" v-model="listTitle" :rules="[rules.required]" clearable
                    :label="tasksListsStore.translate('pages.newList.enterListTitle')"></v-text-field>

                <!-- <ul class="w-100 flex items-center justify-evenly mb-3 gap-1 list-none">
                    <li @click="selectColor(color)" v-for="color in listColors" :style="{ backgroundColor: color }"
                        class="w-[30px] h-[30px] rounded-full border-4" :class="listColor === color ? 'border-slate-700' : 'border-transparent'">
                    </li>
                </ul> -->

                <!-- <div class="flex items-center justify-around w-100"> -->
                <!-- <v-btn color="blue-grey-darken-3" @click="goToTasksListPage" size="large" variant="text">Cancel</v-btn> -->
                <v-btn class="w-full sm:w-auto" color="blue-grey-darken-3" type="submit" size="large">{{
                    tasksListsStore.translate('pages.newList.addList') }}</v-btn>
                <!-- </div> -->
            </v-form>
        </template>

    </Layout>
</template>

<script>
// import { listColors } from '../data/data';
import { useTasksStore } from '../../store/tasks';
import Layout from '../UI/Layout/Layout.vue';

export default {
    components: {
        Layout
    },
    data() {
        return {
            tasksListsStore: useTasksStore(),
            // listColors,
            listTitle: '',
            // listColor: listColors[1],
            rules: {
                required: value => !!value || this.tasksListsStore.translate('validations.required'),
            },
        }
    },
    methods: {
        // goToTasksListPage() {
        //     this.$router.push('/lists');
        // },
        // selectColor(color) {
        //     this.listColor = color;
        // },
        addList() {
            if (this.listTitle.trim() === '') {
                // console.error('Enter a valid title!');
                return;
            }
            this.tasksListsStore.addList({
                title: this.listTitle
                // color: this.listColor 
            });
            this.$router.push('/lists');
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