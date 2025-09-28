import { MainNavigation } from '@/components/blocks/main-navigation';
import { MainNavigationWithMega } from '@/components/blocks/main-navigation-with-mega';
import { getNavigationData } from '@/lib/navigation';
import { NavigationData } from '@/types/navigation';

interface LayoutWithNavigationProps {
  children: React.ReactNode;
  darkMode?: boolean;
  sticky?: boolean;
  floating?: boolean;
}

export async function LayoutWithNavigation({ 
  children, 
  darkMode = true,
  sticky = false,
  floating = false 
}: LayoutWithNavigationProps) {
  // Fetch navigation data from CMS
  const navigationData: NavigationData = await getNavigationData();

  // Choose navigation component based on CMS setting
  const NavigationComponent = navigationData.settings.useMegaMenu 
    ? MainNavigationWithMega 
    : MainNavigation;

  return (
    <>
      <NavigationComponent
        darkMode={darkMode}
        sticky={sticky}
        floating={floating}
        navigationData={navigationData}
        {...(navigationData.settings.useMegaMenu && { useMegaMenu: true })}
      />
      {children}
    </>
  );
}