<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script>
import { useTasksStore } from './store/tasks';
export default {
  data() {
    return {
      taskListsStore: useTasksStore()
    }
  },
  mounted() {
    this.taskListsStore.load();
  }
}
</script>

