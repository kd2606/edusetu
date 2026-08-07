import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { BookOpen, Target, Dumbbell, Rocket, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export type CachedYouTubeVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
};

export type RoadmapNodeData = {
  label: string;
  description: string;
  category: 'prerequisite' | 'core' | 'practice' | 'project';
  priority: 'critical' | 'high' | 'medium';
  time_allocation: string;
  completed?: boolean;
  resources?: Array<{ type: string; title: string; url: string; }>;
  id: string;
  onToggleComplete?: (id: string, completed: boolean) => void;
  youtube_videos?: {
    videos: CachedYouTubeVideo[];
    fetched_at: string;
  };
};

const categoryIcons = {
  prerequisite: BookOpen,
  core: Target,
  practice: Dumbbell, // Or Code, but Dumbbell was suggested
  project: Rocket,
};

const priorityColors = {
  critical: 'bg-error shadow-e2',
  high: 'bg-progress shadow-e2',
  medium: 'bg-accent shadow-e2',
};

export type RoadmapNodeType = Node<RoadmapNodeData, 'roadmapNode'>;

export function RoadmapNode({ data }: NodeProps<RoadmapNodeType>) {
  const Icon = categoryIcons[data.category] || BookOpen;

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-2 h-2 bg-muted-foreground border-none" 
      />
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={cn(
          "w-64 bg-surface backdrop-blur-xl rounded-lg shadow-rim border border-outline-variant flex flex-col p-3 relative text-on-surface hover:border-outline transition-colors",
          data.completed ? "opacity-60" : "opacity-100"
        )}
      >
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex items-center gap-2 overflow-hidden">
             <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
             <h3 className="text-sm font-semibold truncate tracking-[-0.02em]">{data.label}</h3>
             <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", priorityColors[data.priority] || priorityColors.medium)} />
          </div>
          <button 
            type="button"
            className="shrink-0 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10"
            onClick={(e) => {
              e.stopPropagation();
              if (data.onToggleComplete) {
                data.onToggleComplete(data.id, !data.completed);
              }
            }}
          >
            {data.completed ? (
              <CheckCircle2 className="w-5 h-5 text-success" />
            ) : (
              <div className="w-4 h-4 border-2 border-muted-foreground/50 rounded-full hover:border-primary transition-colors" />
            )}
          </button>
        </div>
        
        <p className="line-clamp-2 text-[13px] leading-[1.5] text-on-surface-variant mb-3">
          {data.description}
        </p>
        
        <div className="flex justify-end mt-auto">
           <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium">
             {data.time_allocation}
           </Badge>
        </div>
      </motion.div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-2 h-2 bg-muted-foreground border-none" 
      />
    </>
  );
}
