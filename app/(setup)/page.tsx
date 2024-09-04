import { initialProfile } from '@/lib/initialProfile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { InitialModel } from '@/components/models/initial-model'
const Setup = async () => {
    const profile = await initialProfile()
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })
     if(server) {
        return redirect(`/server/${server.id}`)
    }

    return (
        <InitialModel />
    )
}

export default Setup
