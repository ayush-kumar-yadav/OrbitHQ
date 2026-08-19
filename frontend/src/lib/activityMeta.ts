import {
  MessageSquare,
  CheckCircle2,
  FilePlus2,
  FolderPlus,
  Pencil,
  Trash2,
  Circle,
} from "lucide-react";

export const ACTION_META: Record<
  string,
  { icon: typeof Circle; label: string; tone: string }
> = {
  COMMENT_ADDED: {
    icon: MessageSquare,
    label: "Comment added",
    tone: "bg-[#4C6FFF]/10 text-[#7187FF]",
  },
  TASK_CREATED: {
    icon: FilePlus2,
    label: "Task created",
    tone: "bg-[#2FD9C4]/10 text-[#2FD9C4]",
  },
  TASK_COMPLETED: {
    icon: CheckCircle2,
    label: "Task completed",
    tone: "bg-[#2FD9C4]/10 text-[#2FD9C4]",
  },
  TASK_UPDATED: {
    icon: Pencil,
    label: "Task updated",
    tone: "bg-[#F5A623]/10 text-[#F5A623]",
  },
  TASK_DELETED: {
    icon: Trash2,
    label: "Task deleted",
    tone: "bg-[#FF5C6C]/10 text-[#FF6B78]",
  },
  PROJECT_CREATED: {
    icon: FolderPlus,
    label: "Project created",
    tone: "bg-[#4C6FFF]/10 text-[#7187FF]",
  },
};

export function metaForAction(action: string) {
  return (
    ACTION_META[action] ?? {
      icon: Circle,
      label: action
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase()),
      tone: "bg-white/[0.06] text-[#8D919D]",
    }
  );
}