import type React from "react"
import { Playfair_Display, DM_Sans, Noto_Sans_Arabic } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { AuthProvider } from "@/lib/auth-context"
import { WishlistProvider } from "@/lib/wishlist-context"
import { ChatWidget } from "@/components/chatbot/chat-widget"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { isRTL } from "@/lib/i18n-config"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Add Arabic font
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: "Pròva - AI-Powered Fashion Platform",
  description:
    "Experience the future of fashion with virtual try-on, smart recommendations, and personalized shopping.",
  generator: 'v0.app'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get current locale and messages
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      dir={isRTL(locale) ? 'rtl' : 'ltr'}
      className={`${playfair.variable} ${dmSans.variable} ${notoArabic.variable}`}
    >
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <ChatWidget />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
