import { RedirectToSignIn } from '@clerk/nextjs'
import {redirect} from 'next/navigation'
import {currentProfile} from "@/lib/current-profile"
import {db} from '@/lib/db'
import {ServerSidebar} from '@/components/server/server-sidebar'
const ServerLayout=async({children,params}:{children:React.ReactNode,params:{serverId:string}})=>{
    const profile= await currentProfile()
    if(!profile){
        return <RedirectToSignIn/>
    }

    const server=await db.server.findUnique({
        where:{
            id:params.serverId,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })
    if(!server){
        return redirect('/')
    }

    return(
        <div className="h-full ">
            <div className="hidden md:flex flex-col h-full w-60 z-20 fixed inset-y-o">
                <ServerSidebar serverId={params.serverId}/>
            </div>
            <main className='h-full md:pl-60'>
              {children}
            </main>
            
        </div>
    )
}
export default ServerLayout