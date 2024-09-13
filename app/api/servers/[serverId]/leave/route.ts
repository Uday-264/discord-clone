import {db} from '@/lib/db'
import {currentProfile} from '@/lib/current-profile'
import { NextResponse } from 'next/server'
export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try {
        const profile=await currentProfile()
        if(!profile){
            return new NextResponse("unauthorized",{status:401})
        }
        const {serverId}=params
        if(!serverId){
            return new NextResponse("serverId is missing",{status:400})
        }
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:{
                    not:profile.id
                }
            },
            data:{
                members:{
                    deleteMany:{
                        profileId:profile.id
                    }
                }
            }
        })
        return NextResponse.json(server)
    } catch (error) {
        console.log("[patch leave]",error)
        return new NextResponse("internal error",{status:500})
    }
}