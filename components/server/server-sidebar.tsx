import { currentProfile } from "@/lib/current-profile"
import {redirect} from 'next/navigation'
import {db} from '@/lib/db'
import ServerHeader from '@/components/server/server-header';
interface ServerSidebarProps {
    serverId:string
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
    const TextChannels=server?.channels.filter((channel)=>channel.type==="TEXT")
    const VoiceChannels=server?.channels.filter((channel)=>channel.type==="AUDIO")
    const VideoChannels=server?.channels.filter((channel)=>channel.type==="VIDEO")
    const members=server?.channels.filter((member)=>member.profileId!==profile.id)
    
    const role=server.members.filter((member)=>member.profileId===profile.id)[0].role;
    return(
        <div className="flex flex-col h-full w-full  dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role}/>
        </div>
    )
}

