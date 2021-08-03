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

import './Logo.scss';

// @ts-ignore
import logo from '../../../assets/icons/icon-72x72.png';

export default function Logo() {
  return (
    <div className="logo-container">
      <img src={logo} title="RetroQuest Icon" id="logo-pic" alt="Logo" className="logo-image" />

      <div className="logo-text-container">
        <label className="logo-text">RetroQuest</label>
        <label className="logo-sub-text">
          A{' '}
          <a className="fordlabs-label" href="https://fordlabs.com" target="_blank" rel="noopener">
            FordLabs
          </a>{' '}
          Product
        </label>
      </div>
    </div>
  );
}
