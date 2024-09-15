import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
// components
import NavigationAction from '@/components/navigation/Navigation-action';
import NavigationItem from '@/components/navigation/Navigation-item';
import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect('/');
  }

  try {
    const servers = await db.server.findMany({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    return (
      <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-zinc-700/10 py-3">
        <NavigationAction />
        <Separator className="h-[2px]  dark:bg-zinc-700 rounded-md" />
        <ScrollArea className="flex-1 w-full gap-4">
          {servers && servers.map((server) => (
            <div key={server.id} className="mb-4">
              <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
            </div>
          ))}
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
          <ModeToggle />
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-[48px] w-[48px]',
              },
            }}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching servers:', error);
    return <div>Error loading sidebar content.</div>;
  }
};

export default NavigationSidebar;
