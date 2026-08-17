import type { TaskItem } from "@/data/dashboard/tasks";

type TaskCardProps = {
  task: TaskItem;
  onMarkDone: (id: number) => void;
};

export default function TaskCard({ task, onMarkDone }: TaskCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 14,
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>{task.title}</h2>
          <p style={{ margin: "6px 0 0" }}>Assigned to: {task.assignee}</p>
        </div>

        <button
          onClick={() => onMarkDone(task.id)}
          disabled={task.status === "done"}
        >
          {task.status === "done" ? "Completed" : "Mark Done"}
        </button>
      </div>

      <div style={{ marginTop: 8 }}>
        <span>{task.status}</span>
      </div>
    </div>
  );
}
