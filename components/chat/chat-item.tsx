"use client"
import { useState,useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import qs from 'query-string'
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {cn} from '@/lib/utils'
import {Member ,Profile,MemberRole} from '@prisma/client'
import { ShieldCheck,ShieldAlert,FileIcon ,Edit,Trash} from 'lucide-react';
import UserAvatar from '@/components/user-avatar'
import ActionTooltip from '@/components/action-tooltip';
import {Form,FormControl,FormField,FormItem} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button'
import {useRouter,useParams} from 'next/navigation'
import {useModel} from '@/hooks/use-model-store';

interface ChatItemprops {
    id:string;
    content:string;
    member:Member &{
        profile:Profile;
    };
    timestamp:string;
    fileUrl:string | null;
    deleted:boolean;
    currentMember:Member;
    isUpdated:boolean;
    socketUrl:string;
    socketQuery:Record<string,string>;
}
const roleIconMap = {
    "GUEST":null,
    'MODERATOR': <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    'ADMIN': <ShieldAlert className="h-4 w-4 ml-2 text-indigo-500"/>
}
const formSchema=z.object({
    content:z.string().min(1),
})
// main
const ChatItem=({id,content,member,timestamp,fileUrl,deleted,currentMember,isUpdated,socketUrl,socketQuery}:ChatItemprops)=>{
    const [isEditing,setIsEditing]=useState(false);
    const [isDeleting,setIsDeleting]=useState(false)
    const router=useRouter();
    const {onOpen}=useModel();
    const params=useParams();
    const onMemberClick=()=>{
        if(member.id===currentMember.id){
            return
        }
        router.push(`/servers/${params?.serverId}/conversation/${member?.id}`)
    }
    useEffect(()=>{
        const handleKeyDown=(event:any)=>{
            if(event.key==='Escape' || event.key=== 27){
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3954033635.
                setIsEditing(false)
            }
        };
        window.addEventListener('keydown',handleKeyDown)
        return ()=>window.removeEventListener('keydown',handleKeyDown)
    },[])
    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            content:content
        }
    })
    const isLoading=form.formState.isSubmitting;
    const onSubmit=async (values:z.infer<typeof formSchema>)=>{
        console.log(values)
        try {
            const url=qs.stringifyUrl({
                url:`${socketUrl}/${id}`,
                query:socketQuery,
            })
            await axios.patch(url,values)
            form.reset();
            router.refresh();
            setIsEditing(false)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        form.reset({
            content:content,
        })
    },[content])
    const fileType=fileUrl?.split('.').pop();
    const isAdmin=currentMember.role===MemberRole.ADMIN;
    const isModerator=currentMember.role===MemberRole.MODERATOR;
    const isOwner=currentMember.id===member.id;
    const canDeleteMessage=!deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage=!deleted && isOwner && !fileUrl;
    const isPDF=fileType==='pdf' && fileUrl;
    const isImage=!isPDF && fileUrl;


    return(
        <div className="relative group flex items-center hover:dark:bg-black/5 p-4 transition w-full">
            <div className={cn("group flex gap-x-2 items-start w-full")}>
                <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
            
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-poiter" onClick={onMemberClick}>
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className='relative h-48 w-48 bg-secondary mt-2 aspect-square rounded-md overflow-hidden border flex items-center '>
                                <Image src={fileUrl} alt={content} fill className='object-cover'/>
                        </a>
                    )}
                    {isPDF &&(
                        <div className="">
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400'/>
                                <a href={fileUrl} target='_blank' rel='noopener noreferrer'
                                    className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'>
                                        PDF File
                                </a>
                            </div>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                     <p className={cn('text-sm text-zinc-600 dark:text-zinc-300',
                        deleted&& "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                     )}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className='text-[10px] mx-2 text-zinc-500 text-400'>
                                edited
                            </span>
                        )}
                     </p>   
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                        <form
                          className="flex items-center w-full gap-x-2 pt-2 "
                          onSubmit={form.handleSubmit(onSubmit)}
                        >
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <div className="relative w-full">
                                    <Input
                                      disabled={isLoading}
                                      className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text0zinc-600 dark:text-zinc-200"
                                      placeholder="Edited message"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button disabled={isLoading} size="sm" variant="primary">
                            Save
                          </Button>
                        </form>
                        <span className="text-[10px] mt-1 text-zinc-400">
                          Press escape to cancel, enter to save
                        </span>
                      </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label='Edit'>
                            <Edit className='cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition '
                            onClick={()=>setIsEditing(true)}/>
                        </ActionTooltip>
                    )}
                    <ActionTooltip label='Delete'>
                        <Trash 
                        onClick={() =>
                            onOpen('deleteMessage', {
                              apiUrl: `${socketUrl}/${id}`,
                              query: socketQuery,
                            })
                          }
                        className='cursor-pointer h-4 w-4 ml-auto text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition '/>
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
export default ChatItem