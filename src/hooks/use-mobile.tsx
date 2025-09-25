import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mediaQueryString = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
    const mql = window.matchMedia(mediaQueryString);

    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mql.matches);

    mql.addEventListener('change', onChange);

    return () => mql.removeEventListener('change', onChange);
  }, []); 

  return isMobile;
}