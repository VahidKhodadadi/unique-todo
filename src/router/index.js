import { createRouter, createWebHistory } from 'vue-router'
import Lists from '../components/Lists/Lists.vue';
import NewList from '../components/NewList/NewList.vue';
import Task from '../components/Task/Task.vue';
import Tasks from '../components/Tasks/Tasks.vue';
import NewTask from '../components/NewTask/NewTask.vue';
import Search from '../components/Search/Search.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/lists',
      name: 'lists',
      component: Lists
    },
    {
      path: '/',
      redirect: '/lists'
    },
    {
      path: '/new-list',
      component: NewList
    },
    {
      path: '/task/:listId/:taskId',
      component: Task,
      name: 'task',
      props: true
    },
    {
      path: '/tasks/:listId',
      component: Tasks
    },
    {
      path: '/new-task',
      name: 'new-task',
      component: NewTask
    },
    {
      path: '/search',
      component: Search
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
