import styles from "../styles/Home.module.css";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import TaskModal from "./components/TaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const router = useRouter();
  const { query } = router;

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [status, setStatus] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    // Simule a obtenção dos dados das tarefas, status e ícones
    const fetchData = async () => {
      // Substitua estas URLs pelas suas URLs reais
      const statusResponse = await fetch(
        "https://my-taskboard-backend.onrender.com/status"
      );
      const statusData = await statusResponse.json();
      setStatus(statusData);

      const tasksResponse = await fetch(
        "https://my-taskboard-backend.onrender.com/tasks"
      );
      const tasksData = await tasksResponse.json();
      setTasks(tasksData);

      const iconsResponse = await fetch(
        "https://my-taskboard-backend.onrender.com/icones"
      );
      const iconsData = await iconsResponse.json();
      setIcons(iconsData);
    };

    fetchData();
  }, []);

  if (!status || !tasks || !icons) return null;

  const getStatusById = (statusId) => {
    return status.find((item) => item.status_id === statusId);
  };

  const getIconById = (iconId) => {
    return icons.find((item) => item.icone_id === iconId);
  };

  const getTaskById = (taskId) => {
    return tasks.find((item) => item.task_id === taskId);
  };

  const openModal = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setShowModal(false);
    router.push("/Home");
  };

  const handleNewTaskClick = (e) => {
    e.preventDefault();
    router.push("/Home");
    openModal(true);
  };

  const handleTaskClick = (taskId, e) => {
    e.preventDefault();
    const task = getTaskById(taskId);
    setSelectedTask(task);
    setShowModal(true);
    //
    router.push({ pathname: "/Home", query: { taskId: taskId - 1 } });
  };

  return (
    <>
      <main className={styles.App}>
        <header className={styles.App_header}>
          <h1>
            <i className={"fa-solid fa-layer-group " + styles.logo}></i> My Task
            Board
          </h1>
          <p>Tasks to keep organised</p>
        </header>

        <div className={styles.tasks}>
          {tasks.map((item) => (
            <div className={styles.tasks_itens} key={item.task_id}>
              <button onClick={(e) => handleTaskClick(item.task_id, e)}>
                <div className={styles.itens_tasks}>
                  <div className={styles.icon_tasks}>
                    {/* Troque por uma imagem real */}
                    <Image
                      className={styles.icones}
                      width={35}
                      height={30}
                      src={getIconById(item.icone_id)?.ico_url}
                      alt={""}
                    />
                  </div>
                  <div className={styles.task_name}>
                    <h3>{item.tsk_name}</h3>
                  </div>
                  <div
                    className={styles.icon_status}
                    dangerouslySetInnerHTML={{
                      __html: getStatusById(item.status_id)?.sts_icon,
                    }}
                  />
                </div>
              </button>
            </div>
          ))}
          <div className={styles.add_task}>
            <button onClick={handleNewTaskClick}>
              <div className="flex gap-8">
                <i className={"fa-solid fa-plus" + styles.icon}></i>
                <div className="tasks_itens_text">
                  <h3>Add tasks</h3>
                </div>
              </div>
            </button>
          </div>
        </div>

        {showModal && <TaskModal task={selectedTask} onClose={closeModal} />}
      </main>
    </>
  );
};

export default Home;
