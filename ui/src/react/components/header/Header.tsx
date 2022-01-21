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

import React, { useMemo, useRef } from 'react';

// import { Link, NavLink } from 'react-router-dom';
// import logoDark from '../../../assets/icons/icon-72x72.png';
// import logoLight from '../../../assets/icons/icon-light-72x72.png';
import useTeam from '../../hooks/useTeam';
import useTheme from '../../hooks/useTheme';
import SaveCheckerService from '../../services/SaveCheckerService';
import Theme from '../../types/Theme';
import { ModalMethods } from '../modal/Modal';
import SettingsDialog from '../settings-dialog/SettingsDialog';

import './Header.scss';

type RqLink = {
  label: 'Retro' | 'Archives' | 'Radiator';
  path: string;
};

const LINKS: RqLink[] = [
  { label: 'Retro', path: '' },
  { label: 'Archives', path: '/archives' },
  { label: 'Radiator', path: '/radiator' },
];

interface Props {
  teamId?: string;
  routeTo?: (string) => void;
}

// @todo import images in react way when app is fully react
const darkLogoPath = '/assets/icons/icon-72x72.png';
const lightLogoPath = '/assets/icons/icon-light-72x72.png';

export default function Header(props: Props) {
  const { teamId } = props;

  const { teamName } = useTeam(teamId);

  const [theme] = useTheme();

  const modalRef = useRef<ModalMethods>();

  const lastSavedText = useMemo(() => {
    if (SaveCheckerService.lastSavedDateTime === '') {
      return 'All changes saved';
    }
    return 'Last change saved at ' + SaveCheckerService.lastSavedDateTime;
  }, []);

  return (
    <>
      <header className="header">
        <div className="left-content">
          <a href="/" className="logo-link">
            <img
              src={theme === Theme.DARK ? lightLogoPath : darkLogoPath}
              className="logo"
              title="RetroQuest"
              alt="RetroQuest"
            />
          </a>
          <div className="horizontal-separator" />
          <div className="team-name">{teamName}</div>
        </div>
        <nav className="center-content">
          {/* @todo change to navlink once app is fully react */}
          {LINKS.map((link) => (
            <a
              key={link.path}
              // className={({ isActive }) => 'nav-link button' + (isActive ? ' activated' : '')}
              className="nav-link button"
              href={`/team/${teamId}${link.path}`}
              // end
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="right-content">
          <div className="last-saved-text">{lastSavedText}</div>
          <button
            className="settings-button fas fa-cog"
            onClick={() => modalRef.current?.show()}
            data-testid="settingsButton"
          />
        </div>
      </header>
      <SettingsDialog ref={modalRef} />
    </>
  );
}
