// ===========================
// Root Layout Component
// ©AngelaMos | 2025
// ===========================

import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export const RootLayout = (): React.JSX.Element => {
  const location = useLocation();

  useLayoutEffect(() => {
    const resetScroll = (): void => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      const scrollContainers = document.querySelectorAll(
        '[class*="container"]',
      );
      scrollContainers.forEach((container) => {
        if (container instanceof HTMLElement) {
          container.scrollTop = 0;
        }
      });
    };

    resetScroll();
    requestAnimationFrame(resetScroll);
  }, [location.pathname]);

  return (
    <div id="app">
      <Outlet />
    </div>
  );
};
