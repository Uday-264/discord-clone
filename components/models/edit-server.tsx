"use client"
import {useEffect} from 'react'
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import FileUpload from "../file-upload"
import {useModel} from '@/hooks/use-model-store'
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
import { UploadButton } from '@/lib/uploadthing'
import {useRouter} from "next/navigation"
const formSchema = z.object({
  name: z.string().min(1, {
    message: "server name is required"
  }),
  imageUrl: z.string().min(1, {
    message: "server image is required"
  })
})

 const CreateServerModel = () => {
  const {isOpen,type,onClose,data}=useModel()
  const {server}=data
  const router=useRouter()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: ""
    }
  })
  useEffect(()=>{
    if(server){
      form.setValue("name",server.name)
      form.setValue("imageUrl",server.imageUrl)
    }
  },[server,form])
  const isLoading = form.formState.isSubmitting
  // handling onsubmit
  const isModelOpen=isOpen && type==='editServer'
 
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      await axios.patch(`/api/servers/${server?.id}`,values)
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
            Customize your Server
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give your server personality with name and image, You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({field})=>(
                    <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="serverImage"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                    )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70 ">
                      servername
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading}
                      className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder="Enter server name"
                      {...field}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary">
                  Create Server
                </Button>
              </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
} 
export default CreateServerModel