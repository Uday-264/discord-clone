
import { currentProfile } from "@/lib/current-profile";
import {RedirectToSignIn} from '@clerk/nextjs'
import {db} from '@/lib/db'
import {redirect} from 'next/navigation'
interface ServerPageProps {
    params:{
        serverId:string;
    }
}
const ServerPage=async({params}:ServerPageProps)=>{
    const profile=await currentProfile()
    if(!profile){
        <RedirectToSignIn/>
    }
    const server=await db.server.findUnique({
        where:{
            id:params.serverId,
            members:{
                some:{
                    profileId:profile?.id
                }
            }
        },
        include:{
            channels:{
                where:{
                    name:"general"
                },
                orderBy:{
                    createdAt:"asc"
                }
            }
        }
    })
    const initailChannel=server?.channels[0];
    if(initailChannel?.name !=="general"){
        return null
    }
    return redirect(`/servers/${params.serverId}/channels/${initailChannel?.id}`)
    return(
        <div>ServerId page</div>
    )
}
export default ServerPage