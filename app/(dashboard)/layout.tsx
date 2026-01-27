import Footer from "../(public)/_components/Footer";
import Header from "../(public)/_components/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </section>
  );
}
