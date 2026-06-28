import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NotificationCarousel from './NotificationCarousel';

// Carousel (44px) + Navbar (80px)
const TOP_BAR_HEIGHT = 124;

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    if (window.AOS) window.AOS.init({ once: true });
  }, [location.pathname]);

  return (
    <>
      {/* Fixed top: notification carousel stacked above navbar, clearly separated */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <NotificationCarousel />
        <Navbar />
      </div>

      {/* Push page content below the fixed top bar */}
      <div style={{ paddingTop: TOP_BAR_HEIGHT }}>
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
