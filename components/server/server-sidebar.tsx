import { currentProfile } from "@/lib/current-profile"
import {redirect} from 'next/navigation'
import {db} from '@/lib/db'
import {channelType,MemberRole} from '@prisma/client'
import {Hash,Mic,Video,ShieldCheck,ShieldAlert} from 'lucide-react'
import {ScrollArea} from '@/components/ui/scroll-area' 
import ServerHeader from '@/components/server/server-header';
import ServerSearch from '@/components/server/server-search'
import ServerSection from '@/components/server/server-section'
import ServerChannel from '@/components/server/server-channel'
import ServerMember from '@/components/server/server-member'
import {Separator} from '@/components/ui/separator'
interface ServerSidebarProps {
    serverId:string
}

const iconMap ={
    [channelType.TEXT] : <Hash className="mr-2 h-4 w-4" />,
    [channelType.AUDIO] : <Mic className="mr-2 h-4 w-4" />,
    [channelType.VIDEO] : <Video className="mr-2 h-4 w-4" />
}
const roleIconMap = {
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR] : <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
    [MemberRole.ADMIN] : <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
}
export const ServerSidebar=async({serverId}:{serverId:string})=>{
    const profile=await currentProfile()
    if(!profile){
        return redirect('/')
    }
    const server=await db.server.findUnique({
        where:{
            id:serverId
        },
        include:{
            channels:{
                orderBy:{
                    createdAt:"asc"
                }
            },
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role:"asc"
                }
            }

        }
    })
    if(!server){
        return redirect('/')
    }
    // console.log(profile.id)
    // console.log("server channel members",server)
    const textChannels=server?.channels.filter((channel)=>channel.type==="TEXT")
    const audioChannels=server?.channels.filter((channel)=>channel.type==="AUDIO")
    const videoChannels=server?.channels.filter((channel)=>channel.type==="VIDEO")
    const members=server?.members.filter((member)=>member.profileId!==profile.id)
    
    const role=server.members.filter((member)=>member.profileId===profile.id)[0].role;
    return(
        <div className="flex flex-col h-full w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role}/>
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch data={
                        [
                            {
                              label:"Text Channels",
                              type:"channel",
                              data:textChannels?.map((channel)=>({
                                icon:iconMap[channel.type],
                                name:channel.name,
                                id:channel.id
                              }))  
                            },
                            {
                                label:"voice Channels",
                                type:"channel",
                                data:audioChannels?.map((channel)=>({
                                  icon:iconMap[channel.type],
                                  name:channel.name,
                                  id:channel.id
                                }))  
                              },
                              {
                                label:"vide Channels",
                                type:"channel",
                                data:videoChannels?.map((channel)=>({
                                  icon:iconMap[channel.type],
                                  name:channel.name,
                                  id:channel.id
                                }))  
                              },
                              {
                                label:"members",
                                type:"member",
                                data:members?.map((member)=>({
                                  icon:roleIconMap[member.role],
                                  name:member.profile.name,
                                  id:member.id
                                }))  
                              }
                        ]
                    }/>
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <div className="space-y-2">
                    {!!textChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        label="Text Channels"
                        role={role}
                        channeltype={channelType.TEXT}
                        />

                        {textChannels.map((channel)=>(
                            <ServerChannel key={channel.id} role={role} channel={channel} server={server}/>
                        ))}
                    </div>
                )}
                </div>
                <div className="space-y-2">
                    {!!audioChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        label="Audio Channels"
                        role={role}
                        channeltype={channelType.AUDIO}
                        />

                        {audioChannels.map((channel)=>(
                            <ServerChannel key={channel.id} role={role} channel={channel} server={server}/>
                        ))}
                    </div>
                )}
                </div>
                <div className="space-y-2">
                {!!videoChannels?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="channels"
                        label="Video Channels"
                        role={role}
                        channeltype={channelType.VIDEO}
                        />

                        {videoChannels.map((channel)=>(
                            <ServerChannel key={channel.id} role={role} channel={channel} server={server}/>
                        ))}
                    </div>
                )}
                </div>
                <div className="space-y-2">
                {!!members?.length && (
                    <div className="mb-2">
                        <ServerSection 
                        sectionType="members"
                        label="Members"
                        role={role}
                        server={server}
                        />

                        {members.map((member)=>(
                            <ServerMember key={member.id} server={server} member={member}/>
))}
                    </div>
                )}
                </div>
            </ScrollArea>
        </div>
    )
}

