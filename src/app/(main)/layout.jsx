import Navbar from "@/share/Navbar"


function MainLayout({ children }) {
    return (
        <section className="flex flex-col min-h-full">
            <Navbar />
            <main className="grow">
                {children}
            </main>
        </section>
    )
}

export default MainLayout