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
import { Link, NavLink } from 'react-router-dom';

import useTheme from '../../hooks/useTheme';
import SaveCheckerService from '../../services/SaveCheckerService';
import SettingsDialog, { SettingsDialogMethods } from '../settings-dialog/SettingsDialog';
import Theme from '../../types/theme';

import './TopHeader.scss';

import logoLight from '../../../assets/icons/icon-light-72x72.png';
import logoDark from '../../../assets/icons/icon-72x72.png';

type RqLink = {
  label: 'retro' | 'archives' | 'radiator';
  path: string;
};

const LINKS: RqLink[] = [
  { label: 'retro', path: '' },
  { label: 'archives', path: '/archives' },
  { label: 'radiator', path: '/radiator' },
];

type TopHeaderProps = {
  teamName: string;
  teamId: string;
};

export default function TopHeader(props: TopHeaderProps) {
  const { teamName, teamId } = props;

  const [theme] = useTheme();

  const dialogRef = React.useRef<SettingsDialogMethods>();

  const lastSavedText = React.useMemo(() => {
    if (SaveCheckerService.lastSavedDateTime === '') {
      return 'All changes saved';
    }
    return 'Last change saved at ' + SaveCheckerService.lastSavedDateTime;
  }, []);

  return (
    <div className="top-header">
      <div className="header-top-content">
        <div className="left-content">
          <Link to="/" className="logo-link">
            <img src={theme === Theme.DARK ? logoLight : logoDark} title="RetroQuest" id="logo" alt="RetroQuest" />
          </Link>
          <div className="horizontal-separator" />
          <div id="teamName">{teamName}</div>
        </div>

        <div className="center-content">
          {LINKS.map((link) => (
            <NavLink
              key={link.path}
              className="nav-link button"
              to={`/team/${teamId}${link.path}`}
              activeClassName="selected"
              exact={true}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="right-content">
          <div className="last-saved-text">{lastSavedText}</div>
          <div
            className="settings-button fas fa-cog"
            onClick={() => dialogRef.current?.show()}
            data-testid="settingsBtn"
          />
        </div>
      </div>
      <SettingsDialog ref={dialogRef} />
    </div>
  );
}
