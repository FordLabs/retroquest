/*
 * Copyright (c) 2021 Ford Motor Company
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

import useTheme from '../../hooks/useTheme';
import Theme from '../../types/Theme';

import './Logo.scss';

import logoLight from '../../../assets/icons/icon-light-72x72.png';
import logoDark from '../../../assets/icons/icon-72x72.png';

export default function Logo() {
  const [theme] = useTheme();

  return (
    <div className="logo-container">
      <img
        className="logo-image"
        src={theme === Theme.DARK ? logoLight : logoDark}
        title="RetroQuest Icon"
        alt="Logo"
      />

      <h1 className="logo-text-container">
        <span className="logo-text">RetroQuest</span>
        <span className="logo-sub-text">
          A{' '}
          <a className="fordlabs-label" href="https://fordlabs.com" target="_blank" rel="noopener">
            FordLabs
          </a>{' '}
          Product
        </span>
      </h1>
    </div>
  );
}
