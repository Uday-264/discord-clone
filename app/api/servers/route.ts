import {db} from '@/lib/db'
import {currentProfile} from "@/lib/current-profile"
import { MemberRole } from '@prisma/client'
import {NextResponse} from "next/server"
import type {NextRequest} from "next/server"
import {v4 as uuidv4} from "uuid"
export async function POST(request: NextRequest) {
  try {
     const {name,imageUrl}=await request.json()
     const profile=await currentProfile()
     if(!profile){
      return NextResponse.json({message:"Unauthorized"},{status:401})
     }
     const server=await db.server.create({
      data:{
         profileId:profile.id,
         name,
         imageUrl,
         inviteCode:uuidv4(),
         channels:{
            create:[
               {name:"general",profileId:profile.id}
            ]
         },
         members:{
            create:[
               {profileId:profile.id,role:MemberRole.ADMIN}
            ]

         }
     }});
     
     return NextResponse.json({
      message:"success",
      data:server
     })
  } catch (error) {
    console.log("[serverPost]",error)
      return NextResponse.json({message:"Internal Error"},{status:500})
  }
}
