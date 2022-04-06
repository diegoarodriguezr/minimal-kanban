import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

function Task({ task, index, state, column, setState }) {
  const [text, setText] = useState(task.content);
  const [isEditable, setIsEditable] = useState(false);
  const [isDeletable, setIsDeletable] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleDelete = () => {
    setState((prevState) => {
      const newState = { ...prevState };
      newState.columns[column.id].taskIds.splice(index, 1);
      localStorage.setItem('state', JSON.stringify(newState));
      return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsEditable(false);
    e.preventDefault();
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <li
          className={
            'relative mt-2 rounded-lg border border-gray-300 bg-white p-3 font-medium text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
          }
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => setIsEditable(true)}
          onFocus={() => setIsEditable(true)}
          onMouseLeave={() => setTimeout(() => setIsEditable(false), 5000)}
        >
          {!isEditable && text}
          {isEditable && (
            <form onSubmit={handleSubmit}>
              <input
                className='font-medium focus:outline-none dark:bg-gray-800 dark:text-gray-200'
                type={text}
                value={text}
                onChange={handleChange}
              />
            </form>
          )}
          <button
            className={
              'absolute top-0 right-0 m-3 text-gray-600 transition duration-300 ease-in-out dark:bg-slate-800 dark:text-gray-600'
            }
            onClick={handleDelete}
          >
            <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </li>
      )}
    </Draggable>
  );
}

export default Task;
