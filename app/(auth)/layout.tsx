export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}>

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-white/30"></div>

      {/* Form */}
      <div className="relative w-full max-w-md z-10">
        {children}
      </div>
    </div>
  );
}
