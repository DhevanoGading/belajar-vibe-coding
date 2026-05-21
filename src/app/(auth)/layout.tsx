export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 via-white to-cyan-50 p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">ANSOS</h1>
        <p className="text-sm text-muted-foreground">Anonim Sosial</p>
      </div>
      {children}
    </div>
  );
}