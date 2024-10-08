"use client"
import ChatWelcome from './chat-welcome'
import ChatItem from './chat-item'
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2,ServerCrash } from "lucide-react";
import { Fragment, useRef,ElementRef } from "react";
import {Member,Profile,Message} from '@prisma/client';
import {format} from 'date-fns';
import { useChatSocket } from '@/hooks/use-chat-socket';
import {useChatScroll} from '@/hooks/use-chat-scroll'
const DATE_FORMAT="d MMM yyyy,HH:mm"
type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    };
};
interface ChatMessagesProps {
    name:string;
    member:Member;
    chatId:string;
    apiUrl:string;
    socketUrl:string;
    socketQuery:Record<string,string>,
    paramKey:"channelId" |  "conversationId";
    paramValue:string;
    type:"channel" | "conversation"
}
const ChatMessages=({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type
}:ChatMessagesProps)=>{
    const queryKey=`chat-${chatId}`;
    const addKey=`chat:${chatId}:messages`;
    const updateKey=`chat:${chatId}:messages:update`;
    const  { data, fetchNextPage, hasNextPage, isFetchingNextPage, status }=useChatQuery({queryKey,apiUrl,paramKey,paramValue})
    
    useChatSocket({
        queryKey,
        addKey,
        updateKey
    });
    const chatRef=useRef<ElementRef<"div">>(null);
    const bottomRef=useRef<ElementRef<"div">>(null);
    useChatScroll({chatRef,
        bottomRef,
        loadMore:fetchNextPage,
        shouldLoadMore:!fetchNextPage && !!hasNextPage,
        count:data?.pages?.[0]?.items?.length ?? 0,
    })
    
    if(status == "pending"){
        return(
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    ...Loading
                </p>
            </div>
        )
    };
    
    if(status=="error"){
        return(
            <div className="flex-1 flex items-center justify-center">
                <ServerCrash className="h-7 w-7 text-zinc-500  my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Something went wrong
                </p>
            </div>
        )
    }
    return(
        <div className="flex-1 flex flex-col py-4 overflow-y-auto" ref={chatRef}>
            {!hasNextPage &&  <div className="flex-1"></div>}
            {!hasNextPage && <ChatWelcome type={type} name={name}/>}
            { hasNextPage &&
                <div className="flex justify-center">
                    {isFetchingNextPage ? 
                        ( <Loader2 className='h-6 w-6 text-zinc-500 animate-spin my-4' />):
                        <button onClick={()=>fetchNextPage()}
                            className='text-xs my-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition'>
                            Load previous messages
                        </button>
                    }
                </div>
            }
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group,i)=>(
                    <Fragment key={i}>
                        {group.items.map((message:MessageWithMemberWithProfile)=>(
                            <div key={message.id} >
                               <ChatItem
                                id={message.id}
                                key={message.id}
                                member={message.member}
                                currentMember={member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt),DATE_FORMAT)}
                                isUpdated={message.updatedAt!==message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}

                               />
                            </div>
                        ))}
                    </Fragment>
                ))}
            </div>
            <div className="" ref={bottomRef}></div>
        </div>
    )
}
export default ChatMessages