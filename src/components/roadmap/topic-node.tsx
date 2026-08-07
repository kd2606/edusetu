"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Check, Lock, Play, Clock3, Video, Sparkles, CircleDashed } from "lucide-react";

export type NodeStatus = "locked" | "available" | "in-progress" | "completed";

export type TopicNodeData = {
  title: string;
  module: string;
  status: NodeStatus;
  estMinutes: number | string;
  videoCount: number;
  progress?: number;
  isMilestone?: boolean;
  onStuck?: (id: string) => void;
};

const STATUS = {
  locked: {
    container: "border-outline-variant bg-surface-container opacity-55 shadow-none",
    hover:     "hover:opacity-75",
    iconWrap:  "bg-surface-high text-on-surface-muted",
    Icon:      Lock,
    label:     "Locked",
    labelCls:  "text-on-surface-muted",
    accent:    "bg-outline-variant",
  },
  available: {
    container: "border-outline-variant bg-surface shadow-e1",
    hover:     "hover:shadow-e3 hover:border-outline",
    iconWrap:  "bg-surface-container text-on-surface-variant",
    Icon:      CircleDashed,
    label:     "Not started",
    labelCls:  "text-on-surface-muted",
    accent:    "bg-outline",
  },
  "in-progress": {
    container: "border-progress/40 bg-surface shadow-e2",
    hover:     "hover:shadow-e4 hover:border-progress/70",
    iconWrap:  "bg-progress-container text-on-progress-container",
    Icon:      Play,
    label:     "In progress",
    labelCls:  "text-progress",
    accent:    "bg-progress",
  },
  completed: {
    container: "border-success/35 bg-surface shadow-e1",
    hover:     "hover:shadow-e3 hover:border-success/60",
    iconWrap:  "bg-success-container text-on-success-container",
    Icon:      Check,
    label:     "Completed",
    labelCls:  "text-success",
    accent:    "bg-success",
  },
} as const;

export type TopicNodeType = Node<TopicNodeData, "roadmapNode">;

function TopicNodeImpl({ id, data, selected }: NodeProps<TopicNodeType>) {
  const statusKey = (data.status || 'available') as keyof typeof STATUS;
  const s = STATUS[statusKey] || STATUS['available'];
  const { Icon } = s;
  const isLocked = data.status === "locked";

  return (
    <div
      className={[
        "group/node relative w-72 select-none rounded-xl border",
        "transition-[box-shadow,border-color,transform,opacity]",
        "duration-200 ease-[var(--ease-standard)]",
        s.container,
        !isLocked && s.hover,
        !isLocked && "hover:-translate-y-0.5 cursor-pointer",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-[var(--color-canvas)]",
      ].filter(Boolean).join(" ")}
    >
      <Handle type="target" position={Position.Top} className="!-top-1" />

      <span className={`absolute left-0 top-4 h-[calc(100%-2rem)] w-[3px] rounded-r-full ${s.accent}`} />

      {data.isMilestone && (
        <span className="text-label-sm absolute -top-2.5 left-5 rounded-full bg-primary
                         px-2 py-0.5 text-on-primary shadow-e1">
          Milestone
        </span>
      )}

      <div className="flex gap-3 p-4 pl-5">
        <div className={`grid size-10 shrink-0 place-items-center rounded-lg ${s.iconWrap}`}>
          <Icon className="size-[18px]" strokeWidth={2.5} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-label-sm truncate text-on-surface-muted">{data.module || "Topic"}</p>
          <h3 className={`text-title mt-1 leading-snug ${
            data.status === "completed"
              ? "text-on-surface-variant"
              : "text-on-surface"
          }`}>
            {data.title}
          </h3>

          <div className="mt-2.5 flex items-center gap-3 text-on-surface-muted">
            <span className="text-label-sm flex items-center gap-1 normal-case tracking-normal">
              <Clock3 className="size-3.5" strokeWidth={2} />
              {data.estMinutes || 45} min
            </span>
            <span className="text-label-sm flex items-center gap-1 normal-case tracking-normal">
              <Video className="size-3.5" strokeWidth={2} />
              {data.videoCount || 3}
            </span>
            <span className={`text-label-sm ml-auto normal-case tracking-normal ${s.labelCls}`}>
              {s.label}
            </span>
          </div>

          {data.status === "in-progress" && (
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-high">
              <div
                className="h-full rounded-full bg-progress transition-[width] duration-500
                           ease-[var(--ease-emphasized)]"
                style={{ width: `${data.progress ?? 0}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {!isLocked && data.status !== "completed" && (
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-200
                        ease-[var(--ease-emphasized)]
                        group-hover/node:grid-rows-[1fr]
                        group-focus-within/node:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <div className="border-t border-outline-variant px-4 py-2 pl-5">
              <button
                onClick={(e) => { e.stopPropagation(); data.onStuck?.(id); }}
                className="nodrag nopan text-label flex h-8 items-center gap-1.5 rounded-full
                           px-3 -ml-1 text-primary transition-colors duration-150
                           hover:bg-primary/10 active:bg-primary/15"
              >
                <Sparkles className="size-4" strokeWidth={2.2} />
                I&apos;m stuck — break this down
              </button>
            </div>
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!-bottom-1" />
    </div>
  );
}

export const TopicNode = memo(TopicNodeImpl);
