"use client"
import axios from "axios"
import * as z from "zod"
import qs from 'query-string'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import {useModel} from '@/hooks/use-model-store'
import {channelType} from '@prisma/client'
import {useEffect} from 'react'
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {useRouter,useParams} from "next/navigation"
const formSchema = z.object({
  name: z.string().min(1, {
    message: "channel name is required"
  }).refine(name=>name!=="general",
    {
      message:"channel name cannot be 'general'"
    }
  ),
  type:z.nativeEnum(channelType)
})

 const EditChannelModel = () => {
  const {isOpen,type,onClose,data}=useModel()
  const {channel,server}=data;
  const router=useRouter()
  const params=useParams()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type:channel?.type || channelType.TEXT 
    }
  })
  useEffect(()=>{
    if(channel){
        form.setValue("name",channel.name)
        form.setValue("type",channel.type)
    }
  },[form,channel])
  const isLoading = form.formState.isSubmitting
  // handling onsubmit
  const isModelOpen=isOpen && type==='editChannel'
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const url=qs.stringifyUrl({
        url:`/api/channels/${channel?.id}`,
        query:{
          serverId:server?.id
        }
      })
      const response=await axios.patch(url,values)
      form.reset();
      router.refresh()
      onClose()
    }
    catch(error){
      console.log("Error:",error)
    }
  }
  const handleClose=()=>{
    onClose()
  }
  return (

    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden '>
        <DialogHeader className='pt-8 px6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Edit channel
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8">
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ">
                      channel name
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="Enter channel name"
                      {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>

                )}
              />
            <FormField 
              control={form.control}
              name="type"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Channel Type</FormLabel>

                  <FormControl>
                    <Select disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select channel type"/>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={channelType.TEXT}>Text</SelectItem>
                          <SelectItem value={channelType.AUDIO}>Audio</SelectItem>
                          <SelectItem value={channelType.VIDEO}>Video</SelectItem>
                        </SelectContent>
                    </Select>
                      </FormControl>
                    <FormMessage/>

                </FormItem>
              )

              }/>
            </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary">
                  Create Channel
                </Button>
              </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
} 
export default EditChannelModel