import {RedirectToSignIn} from '@clerk/nextjs'
import {redirect} from 'next/navigation'
import {currentProfile} from '@/lib/current-profile'
import {db} from '@/lib/db'
interface InviteCodePageParams{
    params:{
        inviteCode:string;
    }
}
const InviteCodePage=async({params}:InviteCodePageParams)=>{
    const profile=await currentProfile();
    if(!profile){
        return <RedirectToSignIn/>
    }
    if(!params?.inviteCode){
        return redirect('/')
    }
    const existingUser=await db.server.findFirst({
        where:{
            inviteCode:params?.inviteCode,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    })
    if(existingUser){
        return redirect(`/servers/${existingUser.id}`)
    }
    const server = await db.server.update({
        where: {
          inviteCode: params.inviteCode, // This will now work because inviteCode is unique
        },
        data: {
          members: {
            create: [
              {
                profileId: profile.id,
              },
            ],
          },
        },
      });
      if(server){
        return redirect(`/servers/${server.id}`)
      }
      
    
    return(
        <div>
            Hello Invite
        </div>
    )
}
export default InviteCodePage