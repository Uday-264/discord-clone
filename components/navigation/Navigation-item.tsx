"use client"
import Image from "next/image"
import {useParams,useRouter} from 'next/navigation'
import {cn} from '@/lib/utils'
import ActionTooltip from '@/components/action-tooltip'

interface NavigationItemprops{
    id:string;
    name:string;
    imageUrl:string;
}
const NavigationItem=({id,name,imageUrl}:NavigationItemprops)=>{
    const params=useParams()
    const router=useRouter()
    const handleClick=()=>{
        router.replace(`/servers/${id}`)
    }
    return(
        <ActionTooltip side="right" align="center" label={name}>
        <button className="group relative flex items-center" onClick={handleClick}>
            <div className={cn("absolute left-0 bg-primary rounded-r-full transition-all  w-[4px]",
            params?.serverId!==id && "group-hover:h-[20px]",
            params?.serverId===id && "h-[36px] duration-150"
            )}/>
            
            <div className={cn("relative group flex mx-3 h-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all  ease-in overflow-hidden",
                params?.serverId===id && "bg-primary/10 text-primary rounded-[16px]"
            )}>
                <Image src={imageUrl}  width={48} height={48} alt={name} className="overflow-hidden "/>
            </div>
        </button>
        </ActionTooltip>
    )
}
export default NavigationItem