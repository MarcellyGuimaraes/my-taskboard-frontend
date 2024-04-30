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
        <header>
          <h2>
            <i className="fa-solid fa-layer-group"></i> My Task Board
          </h2>
          <p>Tasks to keep organised</p>
        </header>

        <div>
          {tasks.map((item) => (
            <div key={item.task_id}>
              <button className="flex gap-64" onClick={(e) => handleTaskClick(item.task_id, e)}>
                <div className="flex gap-8">
                  <div className="tasks_itens_icon">
                    {/* Troque por uma imagem real */}
                    <Image width={30} height={30} src={getIconById(item.icone_id)?.ico_url} alt={item.ico_name} />
                  </div>
                  <div className="tasks_itens_text">
                    <h3>{item.tsk_name}</h3>
                  </div>
                </div>
                <div className="tasks_itens_status" dangerouslySetInnerHTML={{ __html: getStatusById(item.status_id)?.sts_icon }} />
              </button>
            </div>
          ))}
          <div className="tasks_itens">
            <button className="flex gap-64" onClick={handleNewTaskClick}>
              <div className="flex gap-8">
                <i className="fa-solid fa-plus"></i>
                <div className="tasks_itens_text">
                  <h3>Add task</h3>
                </div>
              </div>
            </button>
          </div>
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
