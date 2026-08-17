export type TaskStatus = "todo" | "in-progress" | "done";

export type TaskItem = {
  id: number;
  title: string;
  status: TaskStatus;
  assignee: string;
};

export const initialTasks: TaskItem[] = [
  { id: 1, title: "Launch product teaser", status: "todo", assignee: "Athira" },
  { id: 2, title: "Repair checkout flow", status: "in-progress", assignee: "Rahul" },
  { id: 3, title: "Update onboarding guide", status: "done", assignee: "Anu" },
  { id: 4, title: "Review campaign metrics", status: "todo", assignee: "Athira" },
  { id: 5, title: "Prepare dev sprint notes", status: "in-progress", assignee: "Rahul" },
  { id: 6, title: "Publish release checklist", status: "done", assignee: "Anu" },
  { id: 7, title: "Test mobile signup flow", status: "todo", assignee: "Athira" },
  { id: 8, title: "Refine dashboard widgets", status: "in-progress", assignee: "Rahul" },
  { id: 9, title: "Draft customer feedback summary", status: "done", assignee: "Anu" },
  { id: 10, title: "Plan weekly standup agenda", status: "todo", assignee: "Athira" },
];
