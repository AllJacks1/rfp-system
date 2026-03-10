import TopNavigationWrapper from "../components/navigation/TopNavigationWrapper";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <TopNavigationWrapper></TopNavigationWrapper>
      <div className="p-6 bg-slate-50">{children}</div>
    </main>
  );
}
