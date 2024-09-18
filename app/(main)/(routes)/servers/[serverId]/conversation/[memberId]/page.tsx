import { RedirectToSignIn } from '@clerk/nextjs';
import {currentProfile} from '@/lib/current-profile'
import {redirect} from 'next/navigation'
import {db} from '@/lib/db'
import {getOrCreateConversation} from '@/lib/conversation'
import ChatHeader from '@/components/chat/chat-header'
interface MemberIdPageProps {
    params:{
        memberId:string;
        serverId:string;
    }
    }

const MemberIdPage=async({params}:MemberIdPageProps)=>{
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
                
        </div>
    )
}
export default MemberIdPage