import { useState } from "react";
import { api } from "~/utils/api";

type Priority = "LOW" | "MEDIUM" | "HIGH";

interface Task {
  id: string;
  title: string;
  description?: string | null;
  completed: boolean;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskManager = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>("MEDIUM");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // tRPCクエリとミューテーション
  const { data: tasks = [], refetch } = api.task.getAll.useQuery();
  const createTask = api.task.create.useMutation();
  const updateTask = api.task.update.useMutation();
  const deleteTask = api.task.delete.useMutation();
  const toggleTask = api.task.toggle.useMutation();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask.mutateAsync({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim() || undefined,
        priority: newTaskPriority,
      });
      
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("MEDIUM");
      await refetch();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: editingTask.title,
        description: editingTask.description || undefined,
        priority: editingTask.priority as Priority,
      });
      
      setEditingTask(null);
      await refetch();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask.mutateAsync({ id });
      await refetch();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      await toggleTask.mutateAsync({ id });
      await refetch();
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case "HIGH": return "priority-high";
      case "MEDIUM": return "priority-medium";
      case "LOW": return "priority-low";
      default: return "priority-medium";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "HIGH": return "高";
      case "MEDIUM": return "中";
      case "LOW": return "低";
      default: return "中";
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '20px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>タスク管理</h1>
          
          {/* タスク作成フォーム */}
          <form onSubmit={handleCreateTask}>
            <div className="form-group">
              <input
                type="text"
                placeholder="新しいタスクのタイトル"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="説明（オプション）"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
            </div>
            <div className="form-row">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="form-select"
              >
                <option value="LOW">低優先度</option>
                <option value="MEDIUM">中優先度</option>
                <option value="HIGH">高優先度</option>
              </select>
              <button
                type="submit"
                disabled={createTask.isLoading}
                className="btn btn-primary"
              >
                {createTask.isLoading ? "作成中..." : "タスク作成"}
              </button>
            </div>
          </form>
        </div>

        {/* タスク一覧 */}
        <div>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 0' }}>
              タスクがありません。新しいタスクを作成してください。
            </p>
          ) : (
            <div>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`task-item ${task.completed ? 'task-completed' : ''}`}
                >
                  {editingTask?.id === task.id ? (
                    /* 編集モード */
                    <form onSubmit={handleUpdateTask}>
                      <div className="form-group">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({ ...editingTask, title: e.target.value })
                          }
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          value={editingTask.description || ""}
                          onChange={(e) =>
                            setEditingTask({ ...editingTask, description: e.target.value })
                          }
                          className="form-textarea"
                          rows={2}
                        />
                      </div>
                      <div className="form-row">
                        <select
                          value={editingTask.priority}
                          onChange={(e) =>
                            setEditingTask({ ...editingTask, priority: e.target.value })
                          }
                          className="form-select"
                        >
                          <option value="LOW">低優先度</option>
                          <option value="MEDIUM">中優先度</option>
                          <option value="HIGH">高優先度</option>
                        </select>
                        <button
                          type="submit"
                          disabled={updateTask.isLoading}
                          className="btn btn-success"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="btn btn-secondary"
                        >
                          キャンセル
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* 表示モード */
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </h3>
                        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </div>
                      {task.description && (
                        <p className="task-description">
                          {task.description}
                        </p>
                      )}
                      <p className="task-meta">
                        作成: {new Date(task.createdAt).toLocaleDateString("ja-JP")}
                      </p>
                      <div className="task-actions">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          disabled={toggleTask.isLoading}
                          className={`btn ${task.completed ? 'btn-secondary' : 'btn-success'}`}
                        >
                          {task.completed ? "未完了に戻す" : "完了"}
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="btn btn-primary"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteTask.isLoading}
                          className="btn btn-danger"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
