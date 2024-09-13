"use client"
import { useState } from "react"
import axios from 'axios'
import {useModel} from '@/hooks/use-model-store'
import { useRouter } from "next/navigation"
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'

 const DeleteServer = () => {

  const [isLoading,setIsLoading]=useState(false)
  const {isOpen,type,onClose,data,onOpen}=useModel()
  const router=useRouter()
  const isModelOpen=isOpen && type==='deleteServer'
  const {server}=data

  const handleLeave=async()=>{
    try{
        setIsLoading(true)
        await axios.delete(`/api/servers/${server?.id}`)
        onClose()
        router.refresh()
        router.push('/')
    }
    catch(error){
        console.log(error)
    }
    finally{
        setIsLoading(false)
    }
  }
  

  return (

    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden '>
        <DialogHeader className='pt-8 px6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Delete server
          </DialogTitle>
        <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this <br/>
            <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently deleted
        </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
                <Button disabled={isLoading}
                onClick={onClose}
                variant="ghost">
                    cancel
                </Button>
                <Button disabled={isLoading}
                onClick={()=>handleLeave()}
                variant="primary">
                    confirm
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
} 
export default DeleteServer