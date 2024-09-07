"use client"
import  CreateServerModel  from "@/components/models/create-server-model"
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
       </div>
    ) 
}