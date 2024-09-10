"use client"
import { useState } from "react"
import axios from 'axios'
import {useModel} from '@/hooks/use-model-store'
import {Input} from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import {Button} from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Copy, RefreshCw ,Check} from "lucide-react"
import { useOrigin } from "@/hooks/use-origin"

 const InviteModel = () => {
  const [copied,setCopied]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const {isOpen,type,onClose,data,onOpen}=useModel()
  const origin=useOrigin()
  const isModelOpen=isOpen && type==='invite'
  const {server}=data
  const inviteUrl=`${origin}/invite/${server?.inviteCode}`
  const onCopy=()=>{
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(()=>{
      setCopied(false)
    },2000)
  }
  const onNew=async()=>{
    try {

      setIsLoading(true)
      const response=await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpen("invite",response.data)
    } catch (error) {
      console.log(error)
    }
    finally{
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2911005667.
      setIsLoading(false)
    }
  }
  return (

    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden '>
        <DialogHeader className='pt-8 px6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Invite friends to join your server
          </DialogTitle>
          
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Servere invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
            value={inviteUrl}
            disabled={isLoading}
            />
            <Button size="icon" onClick={onCopy} disabled={isLoading}>
              {copied? <Check className="w-4 h-4"/>:<Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button variant="link" size="sm" className="text-xs text-zinc-500 mt-4" onClick={onNew} disabled={isLoading}>
            Generate a new link
            <RefreshCw className="h-4 w-4 ml-2"/>
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
} 
export default InviteModel