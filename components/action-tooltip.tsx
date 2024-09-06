"use client"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {Button} from '@/components/ui/button'

  interface TooltipAction{
    label:string;
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2019462970.
    children:React.ReactNode;
    side?:"top" | "right" | "bottom" | "left" ;
    align?:"start" | "center" | "end";
  }

  const  TooltipAction=({
    label,children,side,align
  }:TooltipAction)=>{
    return(
        <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="text-semibold text-sm capitalize">
            {label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    )
  }
export default TooltipAction