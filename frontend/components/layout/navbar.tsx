"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Search, ShoppingBag, Heart, User, LogOut, Shield, Store, Headphones } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useWishlist } from "@/lib/wishlist-context"
import { useAuth } from "@/lib/auth-context"

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { totalItems } = useCart()
  const { wishlistItems } = useWishlist()
  const { user, logout, isAuthenticated, isAdmin, isStoreOwner, isCustomerService } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl font-semibold tracking-tight">Pròva</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/virtual-tryon" className="text-sm font-medium hover:text-primary transition-colors">
              Virtual Try-On
            </Link>
            <Link href="/recommendations" className="text-sm font-medium hover:text-primary transition-colors">
              For You
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block p-2 hover:bg-muted rounded-full transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/wishlist" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 z-20">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-primary font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      )}
                      {isStoreOwner && (
                        <Link
                          href="/store-owner"
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-primary font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Store className="w-4 h-4" />
                          Store Dashboard
                        </Link>
                      )}
                      {isCustomerService && (
                        <Link
                          href="/customer-service"
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-primary font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Headphones className="w-4 h-4" />
                          CS Dashboard
                        </Link>
                      )}
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile?tab=orders"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        href="/profile?tab=wishlist"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/virtual-tryon"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Virtual Try-On
            </Link>
            <Link
              href="/recommendations"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              For You
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-base font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 text-base font-medium text-primary flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
                {isStoreOwner && (
                  <Link
                    href="/store-owner"
                    className="block py-2 text-base font-medium text-primary flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Store className="w-5 h-5" />
                    Store Dashboard
                  </Link>
                )}
                {isCustomerService && (
                  <Link
                    href="/customer-service"
                    className="block py-2 text-base font-medium text-primary flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Headphones className="w-5 h-5" />
                    CS Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left py-2 text-base font-medium text-destructive"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2 text-base font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
