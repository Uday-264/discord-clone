import {
    Avatar,
    AvatarImage,
  } from "@/components/ui/avatar"
import {cn} from '@/lib/utils'
interface UserAvatarProps {
  src?:string,
  className?:string
}
const UserAvatar=({src,className}:UserAvatarProps)=>{
    return(
    <Avatar className={cn('h-6 w-6 md:w-10 md md:h-10',className)} >
        <AvatarImage src={src} alt="@shadcn" />
    </Avatar>
    )
}
export default UserAvatar