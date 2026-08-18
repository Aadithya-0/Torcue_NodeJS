type TaskCardProps = {
  task: {
    id: number;
    title: string;
    status: "todo" | "in-progress" | "done";
    assignee: string;
  };
  onMarkDone: (id: number) => void;
};

export default function TaskCard({ task, onMarkDone }: TaskCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h3 style={{ margin: 0 }}>{task.title}</h3>
          <p style={{ margin: "6px 0 0" }}>Assignee: {task.assignee}</p>
        </div>

        <span
          style={{
            padding: "6px 10px",
            borderRadius: 999,
            background: task.status === "done" ? "#d1fae5" : "#f3f4f6",
            color: task.status === "done" ? "#065f46" : "#374151",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {task.status}
        </span>
      </div>

      {task.status !== "done" && (
        <button
          onClick={() => onMarkDone(task.id)}
          style={{ marginTop: 12, padding: "8px 12px" }}
        >
          Mark as done
        </button>
      )}
    </div>
  );
}
