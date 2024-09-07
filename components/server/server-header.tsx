
import { ServerWithMembersWithProfiles } from '@/types';
import {MemberRole} from '@prisma/client'
import {ChevronDown,SettingsIcon,UserPlus,Users,PlusCircle,Trash, LogOut} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
interface ServerHeaderProps{
    server:ServerWithMembersWithProfiles;
    role?:MemberRole;
}
const ServerHeader=({server,role}:ServerHeaderProps)=>{
    const isAdmin=role===MemberRole.ADMIN
    const isModerator= role===MemberRole.MODERATOR || role===MemberRole.ADMIN

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className='focus-outline-none' asChild>
                <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
                    {server.name}
                    <ChevronDown className='h-5 w-5 ml-auto'/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                    {isModerator && (
                        <DropdownMenuItem className='text-indigo-600 dark:text-indigo-400 px-3 py-2 sm cursor-ponter'>
                            Invite People
                            <UserPlus className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem className='px-3 py-2 sm cursor-ponter'>
                            Server Settings
                            <SettingsIcon className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem className='px-3 py-2 sm cursor-ponter'>
                            Manage member
                            <Users className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem className='px-3 py-2 sm cursor-ponter'>
                            Create Channels
                            <PlusCircle className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuSeparator/>
                    ) 
                    }
                     {isAdmin && (
                        <DropdownMenuItem className='text-rose-500 px-3 py-2 sm cursor-ponter'>
                            Delete server
                            <Trash className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem className='text-rose-500 px-3 py-2 sm cursor-ponter'>
                            Leave server
                            <LogOut className='h-4 w-4 ml-auto'/>
                        </DropdownMenuItem>
                    )}

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default ServerHeader