import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Как создать продукт за 90 дней | Пошаговый план",
  description: "Пошаговый план для создания цифрового продукта с нуля до первых продаж за 90 дней. Получите структурированный подход и избежите ошибок.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
