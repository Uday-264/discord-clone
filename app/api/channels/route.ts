import {db} from '@/lib/db'
import {NextResponse} from 'next/server'
import { currentProfile } from '@/lib/current-profile'
import {MemberRole} from '@prisma/client'
export async function POST(req:Request) {
    try {
        const profile=await currentProfile()
        const {name,type}=await req.json()
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get('serverId')
        if(!serverId){
            return new NextResponse("serve Id not found",{status:401})
        }
        if(name==="general"){
            return new NextResponse("name cannot be general",{status:402})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                            }
                    }
                }
            },
            data:{
                channels:{
                    create:{
                        profileId:profile.id,
                        name,
                        type
                    }
                }
            }
            })
        return NextResponse.json(server)

    } catch (error) {
        console.log("[channels_post]",error)
        return new NextResponse("internal error",{status:500})
    }
    
}
