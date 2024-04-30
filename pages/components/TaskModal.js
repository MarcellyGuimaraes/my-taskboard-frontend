import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskModal = ({ task, onClose, icons, status }) => {
  const [taskData, setTaskData] = useState({
    tsk_name: "",
    tsk_description: "",
    icone_id: null, // Adicionando campo para o ícone
    status_id: null, // Adicionando campo para o status
  });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
            <h3 className="text-3xl font-semibold">
              {task ? "Edit Task" : "New Task"}
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="tsk_name"
                  value={taskData.tsk_name}
                  onChange={handleChange}
                  placeholder="Task Name"
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="tsk_description"
                  value={taskData.tsk_description}
                  onChange={handleChange}
                  placeholder="Task Description"
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <select
                  name="icon_id"
                  value={taskData.icone_id}
                  onChange={handleChange}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select Icon</option>
                  {icons.map((icon) => (
                    <option key={icon.icone_id} value={icon.icone_id}>
                      {icon.ico_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
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
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
