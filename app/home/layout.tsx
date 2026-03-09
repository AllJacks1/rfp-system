import TopNavigation from "./TopNavigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TopNavigation />
      <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
