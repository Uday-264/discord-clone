"use client"
import  CreateServerModel  from "@/components/models/create-server-model"
import InviteModel from '@/components/models/invite-people'
import EditServerModel from "@/components/models/edit-server"
import MemberModel from '@/components/models/members-model'
import CreateChannelModel from "@/components/models/create-channel-model"
import LeaveServer from '@/components/models/leave-serer-model'
import DeleteServer from '@/components/models/delete-server-model'
import { useEffect, useState } from "react"

export const ModelProvider=()=>{
    const[mounted,setMounted]=useState(false)
    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted){
        return null
    }
    return(
       <div>
        <CreateServerModel/>
        <InviteModel/>
        <EditServerModel/>
        <MemberModel/>
        <CreateChannelModel/>
        <LeaveServer/>
        <DeleteServer/>
       </div>
    ) 
}