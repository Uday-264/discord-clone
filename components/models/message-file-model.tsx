"use client"
import axios from "axios"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import FileUpload from "../file-upload"
import { useModel } from "@/hooks/use-model-store"
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
  FormItem,
  FormMessage
} from "@/components/ui/form"
import qs from 'query-string'
import { Button } from "@/components/ui/button"
import {useRouter} from "next/navigation"
const formSchema = z.object({
    fileUrl: z.string().min(1, {
    message: "attachment image is required"
  })
})

const MessageFileModel = () => {
  const router=useRouter()
  const {isOpen,onClose,type,data} = useModel();
  const {apiUrl,query}=data
  const isModelOpen=isOpen && type==="messageFile";
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fileUrl: ""
    }
  })
  const isLoading = form.formState.isSubmitting
  const handleClose=()=>{
    form.reset();
    onClose()
  }
  // handling onsubmit
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
        const url=qs.stringifyUrl({
            url:apiUrl || "",
            query,
        });
      const response=await axios.post(url,{
        ...values,content:values.fileUrl
      })
      form.reset();
      router.refresh()
      handleClose()
    }
    catch(error){
      console.log("Error:",error)
    }
  }
 
  return (

    <Dialog open={isModelOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden '>
        <DialogHeader className='pt-8 px6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Add an attachment
          </DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Send a file as a message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-8">
              <div className="flex justify-center items-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({field})=>(
                    <FormItem>
                    <FormControl>
                      <FileUpload 
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                    )}
                />
              </div>
             
            </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant="primary">
                  Send
                </Button>
              </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  )
} 
export default MessageFileModel