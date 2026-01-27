import Footer from "./_components/Footer";
import Header from "./_components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <Header />
            <main className="w-full">
                {children}
            </main>
            <Footer/>
        </section>
    );
}
