"use client";
import { Channel, MemberRole, Server, channelType } from "@prisma/client";
import { Hash, Mic, Video,Trash,Edit,Lock } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import ActionTooltip from "../action-tooltip";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap= {
  [channelType.TEXT]: <Hash className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"  />,
  [channelType.AUDIO]: <Mic className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400"  />,
  [channelType.VIDEO]: <Video className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />,
};

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();
  const Icon = iconMap[channel.type]; // Ensure Icon is valid here
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };


  return (
    <button
      onClick={() => {}}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-shadow mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {Icon && (
        Icon 
      )}
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
            'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit
            //   onClick={(e) => onAction(e, 'editChannel')}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
            //   onClick={(e) => onAction(e, 'deleteChannel')}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-500" />
      )}
    </button>
  );
};

export default ServerChannel;
