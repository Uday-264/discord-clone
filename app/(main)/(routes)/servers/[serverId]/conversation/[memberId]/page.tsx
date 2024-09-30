import { RedirectToSignIn } from '@clerk/nextjs';
import {currentProfile} from '@/lib/current-profile'
import {redirect} from 'next/navigation'
import {db} from '@/lib/db'
import {getOrCreateConversation} from '@/lib/conversation'
import ChatHeader from '@/components/chat/chat-header';
import ChatMessages from '@/components/chat/chat-messages'
import ChatInput from '@/components/chat/chat-input';
import {MediaRoom} from '@/components/media-room'
interface MemberIdPageProps {
    params:{
        memberId:string;
        serverId:string;
    },
    searchParams:{
        video?:boolean
    }
    }

const MemberIdPage=async({params,searchParams}:MemberIdPageProps)=>{
    const profile=await currentProfile()
    if(!profile){
        return <RedirectToSignIn/>
    }
    const currentMember=await db.member.findFirst({
        where:{
            serverId:params.serverId,
            profileId:profile.id    
        }
    })
    if(!currentMember){
        return redirect('/')
    }
    const conversation=await getOrCreateConversation(currentMember.id,params.memberId)
    if(!conversation){
        return redirect(`/servers/${params.serverId}`)
    }
    const {memberOne,memberTwo} = conversation;
    const otherMember=memberOne.id===profile.id?memberTwo:memberOne;
    return(
        <div className='bg-white dark:bg-[#313338] flex flex-col min-h-screen'>
            <ChatHeader 
                imageUrl={otherMember.profile.imageUrl}
                type="conversation"
                serverId={params.serverId}
                name={otherMember.profile.name}
                />
            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                />
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                member={currentMember}
                name={otherMember.profile.name}
                chatId={conversation.id}
                type="conversation"
                apiUrl="/api/direct-messages"
                paramKey="conversationId"
                paramValue={conversation.id}
                socketUrl="/api/socket/direct-messages"
                socketQuery={{ conversationId: conversation.id }}
            />
            <ChatInput
                name={otherMember.profile.name}
                type="conversation"
                apiUrl="/api/socket/direct-messages"
                query={{ conversationId: conversation.id }}
            />
                </>
            )}
                
        </div>
    )
}
export default MemberIdPage