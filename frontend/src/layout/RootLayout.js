// src/layouts/RootLayout.jsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'

export const RootLayout = () => {
  return (
    <>
    <div className="flex flex-col min-h-screen justify-between">
      {/* Navbar visible on all authenticated pages */}
      <Navbar isProductList={true} />
      
      <main className="min-h-screen">
        <Outlet />
      </main>
      
      {/* Footer visible on all authenticated pages */}
      <Footer />

    </div>
    </>
  )
}
