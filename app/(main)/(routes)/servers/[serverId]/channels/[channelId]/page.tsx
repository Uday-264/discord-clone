import {db} from '@/lib/db'
import { currentProfile } from '@/lib/current-profile';
import {RedirectToSignIn} from '@clerk/nextjs';
import {redirect} from 'next/navigation'
import {channelType} from '@prisma/client'
import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages';
import {MediaRoom} from '@/components/media-room';

interface ChannelIdPageProps{
    params:{
        serverId:string;
        channelId:string;
    }
}
const ChannelIdPage=async({params}:ChannelIdPageProps)=>{
    const profile=await currentProfile()
    if(!profile){
        return <RedirectToSignIn/>
    }
    const {serverId,channelId}=params;
    const channel=await db.channel.findFirst({
        where:{
            id:channelId,
            serverId:serverId
        }
    })
    const member=await db.member.findFirst({
        where:{
            profileId:profile.id,
            serverId:serverId
        }
    })
    if(!channel || !member){
        return redirect(`/`)
    }

    // console.log(channel)
    return(
        <div className='bg-white dark:bg-[#313338] h-full flex flex-col min-h-screen'>
            <ChatHeader name={channel.name}
                serverId={channel.serverId}
                type='channel'
                />
            <div className="flex-1">Future messages</div>
                {channel.type==channelType.TEXT && (
                    <>
                        <ChatMessages
                            name={channel.name}
                            member={member}
                            chatId={channel.id}
                            apiUrl='/api/messages'
                            socketUrl='/api/socket/messages'
                            socketQuery={{
                                channelId:channelId,
                                serverId:serverId
                            }}
                            paramKey="channelId"
                            paramValue={channel.id}
                            type='channel'
                        />
                    </>
                )}

                {channel.type==channelType.AUDIO && (
                    <MediaRoom
                        chatId={channel.id}
                        video={false}
                        audio={true}
                    />
                )}

                {channel.type==channelType.VIDEO && (
                    <MediaRoom
                        chatId={channel.id}
                        video={true}
                        audio={false}
                    />
                )}
            
            <ChatInput name={channel.name} 
                type='channel'
                apiUrl='/api/socket/messages'
                query={{
                    channelId:channelId,
                    serverId:channel.serverId
                }}/>
            
        </div>
    )
}
export default ChannelIdPage;