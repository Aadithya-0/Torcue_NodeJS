"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/dashboard/TaskCard";
import { createTaskSchema } from '@/lib/schemas/task';


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

type DecodedToken = {
  userId: number;
  username: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [currentUser, setCurrentUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    const username = sessionStorage.getItem("username");

    if (!userId || !username) {
      router.replace("/");
      return;
    }

    setCurrentUser({ userId: parseInt(userId), username });
    fetchTasks(parseInt(userId));
  }, [router]);

  const mapTask = (task: BackendTask): TaskItem => ({
    id: task.id,
    title: task.title,
    status: task.completed ? "done" : "todo",
    assignee: task.user?.username ?? "Unassigned",
  });

  const fetchTasks = async (userId: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/tasks/user/${userId}`, {
        credentials: "include",
      });

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

  const handleMarkDone = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
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


const handleAddTask = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!currentUser) {
    setError("Not authenticated");
    return;
  }

  try {
    // Validate before sending
    const result = createTaskSchema.safeParse({
      title: newTitle.trim(),
      description: newDescription.trim() || undefined,
    });

    if (!result.success) {
      // Show first validation error
      const errors = result.error.flatten().fieldErrors;
      const firstErrorMessage = Object.values(errors)[0]?.[0] as string;
      setError(firstErrorMessage || "Validation failed");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...result.data,
        userId: currentUser.userId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Could not create task");
    }

    const createdTask: BackendTask = await res.json();
    setTasks((current) => [mapTask(createdTask), ...current]);
    setNewTitle("");
    setNewDescription("");
    setShowAddTask(false);
    setError("");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Unable to create task");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>
          {currentUser ? `${currentUser.username}'s Tasks` : "Task Board"}
        </h1>
        <button
          onClick={() => {
            // Call logout endpoint to clear httpOnly cookie
            fetch("http://localhost:4000/auth/logout", {
              method: "POST",
              credentials: "include",
            }).then(() => {
              // Clear session storage
              sessionStorage.removeItem("userId");
              sessionStorage.removeItem("username");
              router.push("/");
            });
          }}
        >
          Logout
        </button>
      </div>

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

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setShowAddTask((value) => !value)}>
          {showAddTask ? "Cancel" : "+ Add Task"}
        </button>
      </div>

      {showAddTask && (
        <form onSubmit={handleAddTask} style={{ marginBottom: 20, display: "grid", gap: 12, maxWidth: 420 }}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Task title"
            style={{ padding: 8 }}
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            style={{ padding: 8 }}
          />
          <button type="submit">Save Task</button>
        </form>
      )}

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
