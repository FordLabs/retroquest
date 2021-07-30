import React from 'react';
import { themes } from '@storybook/theming';

import '../src/styles/styles.scss';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Theme',
    defaultValue: '',
    toolbar: {
      icon: 'mirror',
      items: [
        { value: '', right: '⬜️️', title: 'Light Theme' },
        { value: 'dark-theme', right: '⬛️', title: 'Dark Theme' },
      ],
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme: themes.dark,
  },
};

const withThemeProvider = (Story, context) => {
  addClassNamesToBody(context.globals.theme);

  return <Story {...context} />;
};

function addClassNamesToBody(theme) {
  let classNames = document.body.getAttribute('class').split(' ');
  classNames = classNames.filter((className) => className !== 'dark-theme');
  classNames.push(theme);

  document.body.setAttribute('class', classNames.join(' '));
}

export const decorators = [withThemeProvider];
