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
        description: editingTask.description,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">タスク管理</h1>
          
          {/* タスク作成フォーム */}
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="新しいタスクのタイトル"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <textarea
                placeholder="説明（オプション）"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LOW">低優先度</option>
                <option value="MEDIUM">中優先度</option>
                <option value="HIGH">高優先度</option>
              </select>
              <button
                type="submit"
                disabled={createTask.isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {createTask.isLoading ? "作成中..." : "タスク作成"}
              </button>
            </div>
          </form>
        </div>

        {/* タスク一覧 */}
        <div className="p-6">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">タスクがありません。新しいタスクを作成してください。</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg ${
                    task.completed ? "bg-gray-50 opacity-75" : "bg-white"
                  }`}
                >
                  {editingTask?.id === task.id ? (
                    /* 編集モード */
                    <form onSubmit={handleUpdateTask} className="space-y-3">
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <textarea
                        value={editingTask.description || ""}
                        onChange={(e) =>
                          setEditingTask({ ...editingTask, description: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <select
                          value={editingTask.priority}
                          onChange={(e) =>
                            setEditingTask({ ...editingTask, priority: e.target.value })
                          }
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="LOW">低優先度</option>
                          <option value="MEDIUM">中優先度</option>
                          <option value="HIGH">高優先度</option>
                        </select>
                        <button
                          type="submit"
                          disabled={updateTask.isLoading}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          キャンセル
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* 表示モード */
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className={`text-lg font-semibold ${
                              task.completed ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority === "HIGH" && "高"}
                            {task.priority === "MEDIUM" && "中"}
                            {task.priority === "LOW" && "低"}
                          </span>
                        </div>
                        {task.description && (
                          <p
                            className={`text-sm ${
                              task.completed ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          作成: {new Date(task.createdAt).toLocaleDateString("ja-JP")}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          disabled={toggleTask.isLoading}
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            task.completed
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-green-100 text-green-800 hover:bg-green-200"
                          } disabled:opacity-50`}
                        >
                          {task.completed ? "未完了に戻す" : "完了"}
                        </button>
                        <button
                          onClick={() => setEditingTask(task)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={deleteTask.isLoading}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm font-medium hover:bg-red-200 disabled:opacity-50"
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
