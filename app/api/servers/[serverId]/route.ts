import {db} from '@/lib/db'
import {currentProfile} from '@/lib/current-profile'
import { NextResponse } from 'next/server'
interface propsType{
    params:{
        serverId:string
    }}
export async function PATCH(request:Request,{params}:propsType) {
    try{
        const profile=await currentProfile()
        const {name,imageUrl}=await request.json()
        if(!profile){
            return new NextResponse("Unauthorized",{status:401})
        }
        const serverId=params.serverId
        const server=await db.server.update({
            where:{
                id:serverId,
                profileId:profile?.id
            },
            data:{
                name,
                imageUrl
            }
        })
        return  NextResponse.json(server)
    }
    catch(error){
        console.log("[server_id_patch]:",error)
        return new NextResponse("Internal Server Error",{status:500})
    }

    
}