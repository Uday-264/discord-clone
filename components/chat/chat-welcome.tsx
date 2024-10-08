"use client"
import { Hash } from "lucide-react";
interface ChatWelcomeProps {
    name:string;
    type:"channel" | "conversation"
}
const ChatWelcome=({name,type}:ChatWelcomeProps)=>{
    return(
        <div className="space-y-2 px-2 mb-2">
            {type ==='channel' && (
                <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center">
                    <Hash className="h-12 w-12 text-white"/>
                </div>
            )}
            <p className="text-xl font-bold md:text-3xl">
                {type==="channel"?"Welcome to #":""}{name}
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 ">
            {type === 'channel'
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}`}
            </p>
        </div>
    )
}
export default ChatWelcome