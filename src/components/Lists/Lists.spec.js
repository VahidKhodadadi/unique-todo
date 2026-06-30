import { mount } from "@vue/test-utils";
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Lists from './Lists.vue';
import { createVuetify } from 'vuetify';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { createPinia, setActivePinia } from 'pinia';

const vuetify = createVuetify({
    components,
    directives,
});

const headingSelector = '[data-test="heading"]';

// Mock the router
const mockRouter = {
    push: vi.fn()
};

// Translation data for tests
const mockTranslations = {
    pages: {
        lists: {
            lists: 'Lists',
            noList: 'No lists available',
            newList: 'New List'
        }
    }
};

// Create a mock store factory
const createMockStore = (lists = []) => ({
    lists,
    configs: {
        country: { lang: 'en', direction: 'ltr' },
        languageData: mockTranslations
    },
    translate: vi.fn((keyChain) => {
        const chainArr = keyChain.split('.');
        let result = mockTranslations;
        for (const key of chainArr) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                return '';
            }
        }
        return result;
    }),
    deleteList: vi.fn(),
    getListById: vi.fn(),
    getTaskById: vi.fn(),
    getStepById: vi.fn(),
    addList: vi.fn(),
    addTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    changeTaskStatus: vi.fn(),
    addStep: vi.fn(),
    deleteStep: vi.fn(),
    changeStepStatus: vi.fn(),
    saveTasks: vi.fn(),
    loadTasks: vi.fn(),
    duplicateList: vi.fn(),
    renameList: vi.fn(),
    renameTask: vi.fn(),
    searchTasks: vi.fn(),
    copyList: vi.fn(),
    convertStepToTask: vi.fn(),
    checkForDueDatedTasks: vi.fn(),
    checkForReminders: vi.fn()
});

describe('Lists Component', () => {
    const createWrapper = (lists = []) => {
        const mockStore = createMockStore(lists);
        
        const pinia = createPinia();
        setActivePinia(pinia);
        
        const wrapper = mount(Lists, {
            global: {
                plugins: [pinia, vuetify],
                mocks: {
                    $router: mockRouter
                }
            }
        });

        // Override the store instance after mount
        wrapper.vm.tasksListsStore = mockStore;

        return wrapper;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Rendering', () => {
        test('Component renders correctly', () => {
            const wrapper = createWrapper();
            expect(wrapper.exists()).toBe(true);
        });

        test('Displays the heading with correct text', () => {
            const wrapper = createWrapper();
            const heading = wrapper.get(headingSelector);
            expect(heading.text()).toContain('Lists');
        });

        test('Displays "No lists available" message when there are no lists', () => {
            const wrapper = createWrapper();
            expect(wrapper.text()).toContain('No lists available');
        });

        test('Renders the "New List" button in the footer', () => {
            const wrapper = createWrapper();
            const newListButton = wrapper.findComponent({ name: 'VBtn' });
            expect(newListButton.exists()).toBe(true);
            expect(wrapper.text()).toContain('New List');
        });

        test('Renders the search icon in the header', () => {
            const wrapper = createWrapper();
            const searchIcon = wrapper.findComponent({ name: 'VIcon' });
            expect(searchIcon.exists()).toBe(true);
        });

        test('Renders an empty list when there are no items', () => {
            const wrapper = createWrapper();
            const listItems = wrapper.findAll('li');
            expect(listItems).toHaveLength(0);
        });
    });

    describe('List Items Display', () => {
        test('Displays list items when lists are available', async () => {
            const mockLists = [
                { id: 1, title: 'Shopping List', tasks: [] },
                { id: 2, title: 'Todo List', tasks: [{ id: 1, title: 'Task 1' }] }
            ];

            const wrapper = createWrapper(mockLists);
            
            // Wait for component to update
            await wrapper.vm.$nextTick();

            const listItems = wrapper.findAll('li');
            expect(listItems).toHaveLength(2);
        });

        test('Displays list title correctly', async () => {
            const mockLists = [
                { id: 1, title: 'My Shopping List', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).toContain('My Shopping List');
        });

        test('Displays task count for each list', async () => {
            const mockLists = [
                { id: 1, title: 'List One', tasks: [{ id: 1 }, { id: 2 }, { id: 3 }] },
                { id: 2, title: 'List Two', tasks: [{ id: 1 }] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const listItems = wrapper.findAll('li');
            expect(listItems[0].text()).toContain('(3)');
            expect(listItems[1].text()).toContain('(1)');
        });

        test('Displays zero task count when list has no tasks', async () => {
            const mockLists = [
                { id: 1, title: 'Empty List', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).toContain('(0)');
        });

        test('Hides "No lists available" message when lists exist', async () => {
            const mockLists = [
                { id: 1, title: 'Test List', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).not.toContain('No lists available');
        });
    });

    describe('Navigation', () => {
        test('Navigates to new list page when "New List" button is clicked', async () => {
            const wrapper = createWrapper();
            const newListButton = wrapper.find('button');
            
            await newListButton.trigger('click');

            expect(mockRouter.push).toHaveBeenCalledWith('/new-list');
        });

        test('Navigates to tasks page when a list item is clicked', async () => {
            const mockLists = [
                { id: 123, title: 'Test List', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const listItem = wrapper.find('li');
            await listItem.trigger('click');

            expect(mockRouter.push).toHaveBeenCalledWith({ 
                name: 'tasks', 
                params: { listId: 123 } 
            });
        });

        test('Navigates to search page when search icon is clicked', async () => {
            const wrapper = createWrapper();
            const searchIcon = wrapper.findComponent({ name: 'VIcon' });
            
            await searchIcon.trigger('click');

            expect(mockRouter.push).toHaveBeenCalledWith('/search');
        });
    });

    describe('Delete functionality', () => {
        test('deleteList method calls store deleteList action', async () => {
            const mockLists = [
                { id: 1, title: 'Test List', tasks: [] }
            ];

            const mockStore = createMockStore(mockLists);

            const pinia = createPinia();
            setActivePinia(pinia);

            const wrapper = mount(Lists, {
                global: {
                    plugins: [pinia, vuetify],
                    mocks: {
                        $router: mockRouter
                    }
                }
            });

            // Override the store instance
            wrapper.vm.tasksListsStore = mockStore;
            
            // Call deleteList method
            wrapper.vm.deleteList(1);

            // Verify the store action was called
            expect(mockStore.deleteList).toHaveBeenCalledWith(1);
        });
    });

    describe('Computed properties', () => {
        test('listItems computed property returns lists from store', async () => {
            const mockLists = [
                { id: 1, title: 'List 1', tasks: [] },
                { id: 2, title: 'List 2', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.listItems).toEqual(mockLists);
        });
    });

    describe('Edge cases', () => {
        test('Handles lists with special characters in title', async () => {
            const mockLists = [
                { id: 1, title: 'List with <special> & "characters"', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).toContain('List with <special> & "characters"');
        });

        test('Handles lists with very long titles', async () => {
            const longTitle = 'A'.repeat(1000);
            const mockLists = [
                { id: 1, title: longTitle, tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).toContain(longTitle);
        });

        test('Handles empty task array correctly', async () => {
            const mockLists = [
                { id: 1, title: 'Empty Tasks List', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const taskCountText = wrapper.find('span').text();
            expect(taskCountText).toBe('(0)');
        });

        test('Handles large number of tasks', async () => {
            const manyTasks = Array.from({ length: 100 }, (_, i) => ({ id: i + 1 }));
            const mockLists = [
                { id: 1, title: 'Many Tasks', tasks: manyTasks }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            expect(wrapper.text()).toContain('(100)');
        });
    });

    describe('Styling and UI', () => {
        test('List items have correct CSS classes', async () => {
            const mockLists = [
                { id: 1, title: 'Test', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const listItem = wrapper.find('li');
            expect(listItem.classes()).toContain('flex');
            expect(listItem.classes()).toContain('w-100');
            expect(listItem.classes()).toContain('justify-between');
            expect(listItem.classes()).toContain('py-2');
            expect(listItem.classes()).toContain('border-b-2');
            expect(listItem.classes()).toContain('hover:cursor-pointer');
            expect(listItem.classes()).toContain('hover:bg-slate-50');
        });

        test('List item text has correct styling classes', async () => {
            const mockLists = [
                { id: 1, title: 'Test', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const textElement = wrapper.find('p.text-slate-800');
            expect(textElement.exists()).toBe(true);
            expect(textElement.classes()).toContain('font-semibold');
        });

        test('Hover cursor is pointer on list items', async () => {
            const mockLists = [
                { id: 1, title: 'Test', tasks: [] }
            ];

            const wrapper = createWrapper(mockLists);
            await wrapper.vm.$nextTick();

            const listItem = wrapper.find('li');
            // Check that the class includes hover:cursor-pointer
            expect(listItem.classes()).toContain('hover:cursor-pointer');
        });
    });
});