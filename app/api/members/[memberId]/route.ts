import { NextResponse } from "next/server"
import {currentProfile} from '@/lib/current-profile'
import {db} from '@/lib/db'
export async function PATCH(req:Request,{params}:{params:{memberId:string}}){
    try {
        const profile=await currentProfile()
        const {searchParams}=new URL(req.url)
        if(!profile){
            return new NextResponse("unauthorized",{status:401})
        }
        const serverId=searchParams.get("serverId")
        const {role}=await req.json()
        if(!serverId){
            return new NextResponse("serverId missing",{status:401})
        }
        if(!params.memberId){
            return new NextResponse("memberId missing",{status:401})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:profile?.id
            },
            data:{
                members:{
                    update:{
                        where:{
                            id:params.memberId,
                            profileId:{
                                not:profile?.id
                            }
                        },
                        data:{
                            role
                        }
                    }
                }
            },
            include:{
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
        return NextResponse.json(server)

    }
     catch (error) {
        console.log("[memberId]:",error)
        return new NextResponse("internal error",{status:500})
    }
}
export async function DELETE(req:Request,{params}:{params:{memberId:string}}){
    try {
        const profile=await currentProfile()
        
        if(!profile){
            return new NextResponse("unauthorized",{status:401})
        }
        const {searchParams}=new URL(req.url)
        const serverId=searchParams.get("serverId")
        if(!serverId){
            return new NextResponse("serverId missing",{status:401})
        }
        if(!params.memberId){
            return new NextResponse("memberId missing",{status:401})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:profile.id
            },
            data:{
                members:{
                    deleteMany:{

                            id:params.memberId,
                            profileId:{
                                not:profile.id
                            
                        }
                    }
                }
            },
            include:{
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
        return NextResponse.json(server)

    } catch (error) {
        console.log("[memberId]:",error)
        return new NextResponse("internal error",{status:500})
    }
}
