import Header from "../(public)/_components/Header";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#faf9f7",
        backgroundImage: "radial-gradient(circle, #e5e0d8 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      <Header />
      <main>{children}</main>
    </div>
  );
}