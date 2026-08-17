"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/dashboard/TaskCard";

const ITEMS_PER_PAGE = 5;
const API_BASE_URL = "http://localhost:4000";

type BackendTask = {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  userId?: number | null;
  user?: {
    id?: number;
    username?: string;
  } | null;
};

type TaskItem = {
  id: number;
  title: string;
  status: "todo" | "in-progress" | "done";
  assignee: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mapTask = (task: BackendTask): TaskItem => ({
    id: task.id,
    title: task.title,
    status: task.completed ? "done" : "todo",
    assignee: task.user?.username ?? "Unassigned",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/tasks`);

      if (!res.ok) {
        throw new Error("Failed to load tasks from the backend");
      }

      const data: BackendTask[] = await res.json();
      setTasks(data.map(mapTask));
      setError("");
    } catch (err) {
      setTasks([]);
      setError("Unable to load tasks from the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMarkDone = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: true }),
      });

      if (!res.ok) {
        throw new Error("Task update failed");
      }

      const updatedTask: BackendTask = await res.json();
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === id
            ? { ...task, status: updatedTask.completed ? "done" : "todo" }
            : task,
        ),
      );
      setError("");
    } catch (err) {
      setError("Unable to mark the task as done.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assignee === assigneeFilter;

    return matchesSearch && matchesStatus && matchesAssignee;
  });

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Task Board</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: 8, minWidth: 180 }}
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: 8 }}
        >
          <option value="all">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={assigneeFilter}
          onChange={(e) => {
            setAssigneeFilter(e.target.value);
            setCurrentPage(1);
          }}
          style={{ padding: 8 }}
        >
          <option value="all">All Assignees</option>
          {Array.from(new Set(tasks.map((task) => task.assignee))).map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
      </div>

      <p>Total tasks: {tasks.length}</p>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && paginatedTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {paginatedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onMarkDone={handleMarkDone} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 20 }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
