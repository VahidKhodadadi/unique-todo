<template>
  <RouterView v-slot="{ Component }">
    <div class="h-screen">
      <div class="h-[40px] bg-slate-300 flex items-center justify-between px-3">
        <div>
          <!-- <v-img class="hover:cursor-pointer w-[30px]" @click="this.$router.push('/')" src="/favicon-96.png"
            height="30"></v-img> -->
        </div>

        <div class="group relative z-20 hover:cursor-pointer">
          <div class="flex justify-end items-center">
            <p class="capitalize mx-3 font-sans">{{ tasksListsStore.configs.country.lang }}</p>
            <div>
              <v-img :src="tasksListsStore.configs.country.flag" height="30" width="30"></v-img>
            </div>
          </div>
          <ul class="absolute top-7 right-0 hidden group-hover:inline-block rounded-sm overflow-hidden">
            <li v-for="cnt in countries" class="flex justify-end items-center bg-slate-200 px-3 hover:bg-slate-300"
              @click="changeCountry(cnt)">
              <span class="capitalize font-sans">{{ cnt.lang }}</span>
              <div :class="!isRTL ? 'ml-3' : 'mr-3'">
                <v-img :src="cnt.flag" height="30" width="30"></v-img>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div :style="{ height: 'calc(100% - 40px)', maxHeight: 'calc(100% - 40px)' }">
        <Transition name="fade">
          <component :is="Component" />
        </Transition>
      </div>
    </div>
  </RouterView>
</template>

<script>
import { useTasksStore, countries } from './store/tasks';

export default {
  data() {
    return {
      tasksListsStore: useTasksStore(),
      countries
    }
  },
  methods: {
    setConfigKey(key, value) {
      this.tasksListsStore.setConfigKey(key, value);
    },
    changeCountry(cnt) {
      this.setConfigKey('country', cnt);
      document.dir = cnt.direction;
    }
  },
  mounted() {
    this.tasksListsStore.loadTasks();
    this.tasksListsStore.loadConfigs();
    this.tasksListsStore.checkForDueDatedTasks();
    this.tasksListsStore.checkForReminders();
  },
  watch: {
    'tasksListsStore.configs.country.lang'(newLang, oldLang) {
      import(`../src/assets/languages/${newLang}.json`).then(newLanguageData => {
        this.tasksListsStore.setLanguageData(newLanguageData.default);
      })
    }
  },
  computed: {
    isRTL() {
      return this.tasksListsStore.configs.country.direction === 'rtl';
    }
  }
}
</script>

<style>
:root[dir='ltr'] * {
  font-family: -apple-system, Inter, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  direction: ltr;
}

:root[dir='rtl'] * {
  font-family: 'Vazir';
  letter-spacing: -1px;
  direction: rtl;
}
</style>

