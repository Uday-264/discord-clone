import NavigationSidebar from '@/components/navigation/Navigation-sidebar'
const  MainLayout=async({children}:{children:React.ReactNode})=>{
    return(
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-20 flex-col fixed inset-y-0 bg-slate-350">
                <NavigationSidebar/>
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
        </div>
    )
}

export default MainLayout