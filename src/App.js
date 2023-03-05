import { useEffect, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import Todo from './components/Todo';
import Form from './components/Form';
import FilterButton from './components/FilterButton';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  // console.log(props);
  // const subject = props.subject;
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState('All');

  const prevTaskLength = usePrevious(tasks.length);

  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
  // const taskList = tasks?.map((task) => (
  // const taskList = props.tasks?.map((task) => (
    <Todo 
      key={task.id} 
      id={task.id} 
      name={task.name} 
      completed={task.completed} 
      toggleTaskCompleted={toggleTaskCompleted} 
      editTask={editTask} 
      deleteTask={deleteTask}
    />
  ));

  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton 
      key={name} 
      name={name} 
      isPressed={name === filter} 
      setFilter={setFilter}
    />
  ));

  function toggleTaskCompleted(id) {
    // console.log(tasks[0])
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return {...task, completed: !task.completed}
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function addTask(name) {
    // alert(name);
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return {...task, name: newName}
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function deleteTask(id) {
    // console.log(id)
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <h1>To-Do - React</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex='-1' ref={listHeadingRef}>{headingText}</h2>
      {/* <h2 id="list-heading">3 tasks remaining</h2> */}
      <ul
        // role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {/* <Todo name="Eat" completed={true} id="todo-0" />
        <Todo name="Sleep" completed={false} id="todo-1" />
        <Todo name="Repeat" completed={false} id="todo-2" /> */}
        {taskList}
      </ul>
    </div>
  );
}

export default App;
