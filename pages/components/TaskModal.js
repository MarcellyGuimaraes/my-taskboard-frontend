import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Image from "next/image";

const TaskModal = ({ task, icons, status, onClose, isOpen }) => {
  const [taskData, setTaskData] = useState({
    tsk_name: "",
    tsk_description: "",
    icone_id: null, // Adicionando campo para o ícone
    status_id: null, // Adicionando campo para o status
  });

  const customStyles = {
    overlay: {
      backgroundColor: "#6767675e",
    },
    content: {
      width: '50%',
      position:'relative',
      float:'right',
      inset: 'none',
      margin: '0 3rem',
      top: '1rem',
      height: '97vh',
      border_radius: '15'
    },
  };

  useEffect(() => {
    if (task) {
      setTaskData({
        tsk_name: task.tsk_name || "",
        tsk_description: task.tsk_description || "",
        icone_id: task.icone_id || null, // Populando o ícone se existir
        status_id: task.status_id || null, // Populando o status se existir
      });
    } else {
      setTaskData({
        tsk_name: "",
        tsk_description: "",
        icone_id: null, // Inicializando o ícone como vazio
        status_id: null, // Inicializando o status como vazio
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('taskData',taskData)
    console.log('task',task)
    try {
      if (task) {
        await axios.put(
          `https://my-taskboard-backend.onrender.com/tasks/${task.task_id}`,
          taskData
        );
      } else {
        await axios.post(
          "https://my-taskboard-backend.onrender.com/tasks",
          taskData
        );
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await axios.delete(`https://my-taskboard-backend.onrender.com/tasks/${task.task_id}`);
      }
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const getStatusById = (statusId) => {
    return status.find(item => item.status_id === statusId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
    >
      <div className="flex items-center">
        <h3 className="text-3xl font-semibold text-left title_details">
          {task ? "Task details" : "New Task"}
        </h3>
        <button
          className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          onClick={onClose}
        >
          <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none top text-orange-400 border border-slate-300 rounded-md">
            ×
          </span>
        </button>
      </div>
      <form className="flex flex-col h-[95%]" onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <h6>Task name</h6>
          <input
            type="text"
            name="tsk_name"
            value={taskData.tsk_name}
            onChange={handleChange}
            placeholder="Task Name"
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500 text-left input"
          />
        </div>
        <div className="mb-4">
          <h6>Description</h6>
          <textarea
            name="tsk_description"
            rows="10"
            value={taskData.tsk_description}
            onChange={handleChange}
            placeholder="Task Description"
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500 text-left input"
          />
        </div>
        <div className="mb-4">
          <h6>Icon</h6>
          <div className="grid grid-cols-6 gap-4">
            {icons && icons.map((icon) => (
                <div key={icon.icone_id}>
                  <input onChange={(e) => setTaskData({...taskData, icone_id: parseInt(e.target.value)})} checked={taskData.icone_id == icon.icone_id} type="radio" id={`icon-${icon.icone_id}`} value={icon.icone_id} class="hidden peer"/>
                  <label htmlFor={`icon-${icon.icone_id}`} class="bg-slate-200 inline-flex items-center justify-between p-5 text-gray-500 bg-slate-100 border-2 border-slate-100 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-amber-200 peer-checked:bg-amber-200 peer-checked:border-amber-200 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-slate-200 hover:border-slate-200 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 p-1">
                    <Image width={30} height={30} src={icon.ico_url} alt={icon.ico_name} />
                  </label>
                </div>
              ))}
          </div>
        </div>
        <div className="mb-4">
          <h6>Status</h6>
          <div className="flex flex-wrap gap-2">
            {status && status.map((sts) => (
              <div key={sts.status_id} className="w-[48%] buttons">
                  <input onChange={(e) => setTaskData({...taskData, status_id: parseInt(e.target.value)})} checked={taskData.status_id === sts.status_id} type="radio" id={`status-${sts.status_id}`} value={sts.status_id} className="hidden peer"/>
                  <label htmlFor={`status-${sts.status_id}`} className="w-full inline-flex items-center p-1 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="tasks_itens_status w-16	pt-3.5 pb-3.5 rounded-lg text-white" dangerouslySetInnerHTML={{ __html: sts.sts_icon }} style={{ backgroundColor: sts.sts_color }} />
                    <span className="pl-2">{ sts.sts_name }</span>
                  </label>
              </div>
              ))}
          </div>
        </div>

        {/* <div className="mb-4">
          <select
            name="status_id"
            value={taskData.status_id}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Status</option>
            {status.map((st) => (
              <option key={st.status_id} value={st.status_id}>
                {st.sts_name}
              </option>
            ))}
          </select>
        </div> */}
        <div className="flex justify-end items-end buttons">
          <button onClick={handleDelete} className="bg-[#97A3B6] w-28 h-7 ml-2.5 rounded-xl text-white">
            Delete {' '} <i class="fa-regular fa-trash-can"></i>
          </button>
          <button type="submit" className="bg-[#3662E3] w-28 h-7 ml-2.5 rounded-xl text-white">
            Save {' '} <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
