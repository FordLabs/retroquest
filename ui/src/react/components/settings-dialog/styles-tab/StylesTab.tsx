/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from 'react';
import classnames from 'classnames';
import { useRecoilState } from 'recoil';

import { ThemeState } from '../../../state/ThemeState';
import Theme from '../../../types/Theme';

// @todo import images in react way when app is fully react
const darkThemeImagePath = './assets/dark-theme-picture.jpg';
const lightThemeImagePath = './assets/light-theme-picture.jpg';

import './StylesTab.scss';

function StylesTab(): JSX.Element {
  const [theme, setTheme] = useRecoilState<Theme>(ThemeState);

  return (
    <div className="tab-body styles-tab-body">
      <div className="label">Appearance</div>
      <div className="tab-heading theme-tab-heading">
        <div className="theme-icon-container">
          <img
            src={lightThemeImagePath}
            className={classnames('theme-image', { selected: theme === Theme.LIGHT })}
            onClick={() => setTheme(Theme.LIGHT)}
            alt="Light Theme"
          />
          <div className="theme-icon-label">light</div>
        </div>
        <div className="theme-icon-container">
          <img
            src={darkThemeImagePath}
            className={classnames('theme-image', { selected: theme === Theme.DARK })}
            onClick={() => setTheme(Theme.DARK)}
            alt="Dark Theme"
          />
          <div className="theme-icon-label">dark</div>
        </div>
      </div>
    </div>
  );
}

export default StylesTab;
