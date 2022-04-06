import Task from './task';
import { Droppable } from 'react-beautiful-dnd';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

function Column({ column, tasks, state, setState }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const keydownHandler = (event) => {
      if (event.keyCode === 13 && event.ctrlKey) {
        document.getElementById('task-input').focus();
      }
    };
    document.addEventListener('keydown', keydownHandler);
    return () => {
      document.removeEventListener('keydown', keydownHandler);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim().length > 0) {
      const newTask = {
        id: `task-${Math.random()}`,
        content: text,
      };
      const tasks = state.tasks;
      const columnCopy = state.columns[column.id];
      const newTaskIds = Array.from(column.taskIds);

      const newTasks = {
        ...tasks,
        [newTask.id]: newTask,
      };

      newTaskIds.push(newTask.id);

      const newColumn = {
        ...columnCopy,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
        tasks: newTasks,
      };

      setState(newState);
      localStorage.setItem('state', JSON.stringify(newState));
      setText('');
    }
  };

  return (
    <div>
      <h2 className='mb-4 pl-2 font-mono text-2xl font-bold dark:text-gray-100'>
        {column.title}
      </h2>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={
              'rounded-lg p-2 transition duration-300 ease-in-out ' +
              (snapshot.isDraggingOver ? ' bg-gray-100 dark:bg-gray-700' : '')
            }
          >
            {tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                column={column}
                index={index}
                state={state}
                setState={setState}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
      <div className='px-2'>
        <form onSubmit={handleSubmit}>
          <input
            id='task-input'
            type='text'
            className={
              'dark:text-gray-20 w-full border-0 border-b-2 border-gray-300 bg-transparent p-3 font-medium focus:outline-none dark:border-gray-800 dark:text-gray-200'
            }
            placeholder='Add a task...'
            value={text}
            onChange={handleChange}
          />
        </form>
      </div>
    </div>
  );
}

export default Column;
