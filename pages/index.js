import styles from '../styles/Home.module.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import TaskModal from './components/TaskModal';

const Home = () => {
  const router = useRouter();
  const { query } = router;

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      // Substitua estas URLs pelas suas URLs reais
      const statusPromise = fetch('https://my-taskboard-backend.onrender.com/status')
        .then(response => response.json())
        .then(data => setStatus(data))
        .catch(error => console.error('Erro ao buscar status:', error));
  
      const tasksPromise = fetch('https://my-taskboard-backend.onrender.com/tasks')
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.error('Erro ao buscar tarefas:', error));
  
      const iconsPromise = fetch('https://my-taskboard-backend.onrender.com/icones')
        .then(response => response.json())
        .then(data => setIcons(data))
        .catch(error => console.error('Erro ao buscar ícones:', error));
  
      // Pode ser útil retornar as Promises para lidar com elas externamente, se necessário
      return [statusPromise, tasksPromise, iconsPromise];
    };
  
    fetchData();
  }, []);  

  if (!status || !tasks || !icons) return null;

  const getStatusById = (statusId) => {
    return status.find(item => item.status_id === statusId);
  };

  const getIconById = (iconId) => {
    return icons.find(item => item.icone_id === iconId);
  };

  const getTaskById = (taskId) => {
    return tasks.find(item => item.task_id === taskId);
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setShowModal(false);
    router.push('/');
  };

  const handleNewTaskClick = (e) => {
    e.preventDefault(); 
    // MUDAR A ROTA SEM REDIRECIONAR
    window.history.pushState(null, null, `/new-task`);
    openModal(null);
  };

  const handleTaskClick = (taskId, e) => {
    e.preventDefault();
    const task = getTaskById(taskId);
    setSelectedTask(task);
    setShowModal(true);
    // MUDAR A ROTA SEM REDIRECIONAR
    window.history.pushState(null, null, `/task/${taskId}`);
  };

  return (
    <>
      <main className="flex flex-col items-center">
        <header className='titulo pl-10'>
          <h2>
            <i className="fa-solid fa-layer-group text-[#E9A23B]"></i> {' '}
            <input className='text-left text-black placeholder-black hover:border-transparent focus:border-transparent focus:outline-none' placeholder='My Task Board'/>
          </h2>
          <p className='pr-[22rem]'>Tasks to keep organised</p>
        </header>

        <div className='w-2/3'>

        {tasks.map((item) => (
            <button key={item.task_id} className='flex w-full p-4 my-4 rounded-xl' style={{ backgroundColor: `${getStatusById(item.status_id)?.sts_color}75`, opacity: 1 }} onClick={(e) => handleTaskClick(item.task_id, e)}>
                <div className='w-[10%] h-[6vh] flex items-center pl-2.5 rounded-lg bg-[#ffff]'>
                  <Image width={30} height={30} src={getIconById(item.icone_id)?.ico_url} alt={item.ico_name} />
                </div>
                <div className='w-4/5 task_title pt-4 pr-96 pl-2.5' style={{ opacity: 1 }}>
                  <h3 className='w-[165%] text-black'>{item.tsk_name}</h3>
                </div>
                <div className='w-[10%] h-[6vh] pt-1 flex items-center pl-5 rounded-lg text-white' dangerouslySetInnerHTML={{ __html: getStatusById(item.status_id)?.sts_icon }} style={{ backgroundColor: getStatusById(item.status_id)?.sts_color }} />
            </button>
        ))}
        
          <button className="flex w-full p-4 my-4 bg-[#F5E8D5] rounded-xl" onClick={handleNewTaskClick}>
            <div className='w-[8%]'>
              <i className="fa-solid fa-plus bg-[#E9A23B] w-[3.5rem] h-[6vh] flex items-center pl-1.5 pt-4 pr-1.5 rounded-lg text-white"></i>
            </div>
            <div className="tasks_itens_text w-[90%] task_title pt-3 pr-96">
              <h3>Add task</h3>
            </div>
          </button>
        </div>

        {/* {showModal && ( */}
          <TaskModal
            task={selectedTask}
            onClose={closeModal}
            icons={icons}
            status={status}
            isOpen={showModal}
          />
        {/* )} */}
      </main>
    </>
  );
};

export default Home;
