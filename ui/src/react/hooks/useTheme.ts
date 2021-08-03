import * as React from 'react';

import Theme from '../types/theme';

export default function useTheme(): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = React.useState<Theme>(getThemeOffBody());

  // This is a temporary hack for storybook until a theme context is setup
  React.useEffect(() => {
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          setTheme(getThemeOffBody());
        }
      });
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return [theme, setTheme];
}

function getThemeOffBody(): Theme {
  return isBodyDarkMode() ? Theme.DARK : Theme.LIGHT;
}

function isBodyDarkMode(): boolean {
  return document.body.getAttribute('class')?.includes(Theme.DARK);
}
