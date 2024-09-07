"use client"
import {Plus} from 'lucide-react'
import TooltipAction from '@/components/action-tooltip'
import { useModel } from '@/hooks/use-model-store'
const NavigationAction=()=>{
    const {onOpen}=useModel()
    return(
        <div>
            <TooltipAction label="Add server" side="right" align="center">
            <button className="group flex items-center" onClick={()=>onOpen("createServer")}>
                <div className="flex w-[48px] h-[48px] dark:bg-neutral-700 rounded-[24px] transition-all items-center justify-center bg-background group-hover:bg-emerald-500 group-hover:rounded-[16px] ">
                    <Plus className='group-hover:text-white trasnsition text-emerald-500'/>
                </div>
            </button>
            </TooltipAction>
        </div>
    )
}
export default NavigationAction