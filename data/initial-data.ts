const initialData = {
  id: '',
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Hello, friend',
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To do',
      taskIds: ['task-1'],
    },
    'col-2': {
      id: 'col-2',
      title: 'Doing',
      taskIds: [],
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

export default initialData;
