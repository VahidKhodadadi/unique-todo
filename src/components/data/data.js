export const data = [
    {
        id: 'list-id-1',
        title: 'list name test',
        color: 'test color',
        createdAtDate: new Date().toISOString(),
        tasks: [
            {
                id: 'task-id-1',
                title: 'task test name',
                dueDate: new Date().setDate(new Date().getDate() - 1),
                createdAtDate: new Date().setDate(new Date().getDate() - 3),
                remindMeAtDate: new Date().setDate(new Date().getDate() - 2),
                completed: false,
                steps: [
                    {
                        id: 'step-id-1',
                        title: 'step 1 test title',
                        createdAtDate: new Date().setDate(new Date().getDate() - 1),
                        completed: false
                    }
                ]
            }
        ]
    },
    {
        id: 'list-id-2',
        title: 'list name test 2',
        color: 'test color 2',
        createdAtDate: new Date().toISOString(),
        tasks: []
    }
];

export const listColors = ['blue', 'red', 'green', 'yellow', 'gray', 'brown', 'crimson'];