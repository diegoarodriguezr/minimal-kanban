import type { NextPage } from 'next';
import Head from 'next/head';
import { ChangeEvent, useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../components/column';
import initialData from '../data/initial-data';

const Home: NextPage = () => {
  const [windowReady, setWindowReady] = useState(false);
  const [state, setState] = useState(initialData);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((prevState) => {
      const newState = { ...prevState };
      newState.id = e.target.value;
      localStorage.setItem('state', JSON.stringify(newState));
      return newState;
    });
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    setWindowReady(true);
    setState(JSON.parse(localStorage.getItem('state')) || initialData);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppable === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setState((prevState) => {
        const newState = { ...prevState };
        newState.columns[newColumn.id] = newColumn;
        localStorage.setItem('state', JSON.stringify(newState));
        return newState;
      });
    }

    if (start !== finish) {
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...start,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds,
      };

      setState((prevState) => {
        const newState = { ...prevState };
        newState.columns[newStart.id] = newStart;
        newState.columns[newFinish.id] = newFinish;
        localStorage.setItem('state', JSON.stringify(newState));
        return newState;
      });
    }
  };

  return (
    <div>
      <Head>
        <title>{`${state.id || 'Minimal Kanban'}`}</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='relative min-h-screen bg-gray-100 dark:bg-gray-900 '>
        <div className='container mx-auto px-5 pt-10 md:px-0'>
          <div className='px-2'>
            <form onSubmit={handleSubmit}>
              <input
                type='text'
                className={
                  'mb-8 w-full border-0 border-b-2 border-gray-300 bg-transparent pb-3 pl-0 font-mono text-2xl font-bold text-gray-800 focus:outline-none dark:border-gray-800 dark:text-gray-200'
                }
                placeholder='Add a title...'
                value={state.id}
                onChange={handleChange}
              />
            </form>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className='grid gap-4 md:grid-cols-3'>
              {windowReady &&
                state.columnOrder.map((columnId) => {
                  const column = state.columns[columnId];
                  const tasks = column.taskIds.map(
                    (taskId) => state.tasks[taskId]
                  );

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      state={state}
                      setState={setState}
                    />
                  );
                })}
            </div>
          </DragDropContext>
        </div>
      </main>
    </div>
  );
};

export default Home;
