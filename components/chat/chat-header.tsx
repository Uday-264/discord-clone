
import {Hash,Menu} from 'lucide-react'
import {MobileToggle} from '@/components/mobile-toggle'
import UserAvatar from '@/components/user-avatar'
import {SocketIndicator} from '@/components/socket-indicator'
import {ChatVideoButton} from '@/components/chat/chat-video-button'
interface ChatHeaderprops {
    serverId:string;
    name:string;
    type:"channel" | "conversation";
    imageUrl?:string;
}
const ChatHeader=({serverId,name,type,imageUrl}:ChatHeaderprops)=>{
    return(
        <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
            <MobileToggle serverId={serverId}/>
            {type==="channel" && (
                <Hash className="w-4 h-4 mr-2 text-zinc-500 dark:text-zinc-400"/>
            )}
            {type==='conversation' && (
                <UserAvatar src={imageUrl} className='h-8 w-8 mr-2'/>
            )
                
            }
            <p className='text-md font-semibold  text-zinc-500 dark:text-zinc-400 mr-2'>
                {name}
            </p>
            <div className="ml-auto flex item-center">
                {type==='conversation' && (
                    <ChatVideoButton/>
                )}
                <SocketIndicator/>
            </div>
        </div>
    )
}
export default ChatHeader
