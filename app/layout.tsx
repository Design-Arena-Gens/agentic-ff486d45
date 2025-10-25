import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sweet Dreams Cake Shop - Premium Handcrafted Cakes",
  description: "Order delicious, handcrafted cakes for any occasion. Browse our selection of chocolate, fruit, and custom cakes.",
  keywords: "cakes, bakery, custom cakes, birthday cakes, wedding cakes, desserts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
