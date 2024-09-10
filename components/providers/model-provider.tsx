"use client"
import  CreateServerModel  from "@/components/models/create-server-model"
import InviteModel from '@/components/models/invite-people'
import EditServerModel from "@/components/models/edit-server"
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
       </div>
    ) 
}