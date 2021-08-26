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

import { ModalMethods } from '../../../components/modal/Modal';
import SettingsDialog from '../../../components/settings-dialog/SettingsDialog';
import useBoard from '../../../hooks/useBoard';
import useTheme from '../../../hooks/useTheme';
import SaveCheckerService from '../../../services/SaveCheckerService';
import Theme from '../../../types/Theme';

import './TeamHeader.scss';

import logoLight from '../../../../assets/icons/icon-light-72x72.png';
import logoDark from '../../../../assets/icons/icon-72x72.png';

type RqLink = {
  label: 'retro' | 'archives' | 'radiator';
  path: string;
};

const LINKS: RqLink[] = [
  { label: 'retro', path: '' },
  { label: 'archives', path: '/archives' },
  { label: 'radiator', path: '/radiator' },
];

export default function TeamHeader() {
  const { teamId, teamName } = useBoard();

  const [theme] = useTheme();

  const modalRef = React.useRef<ModalMethods>();

  const lastSavedText = React.useMemo(() => {
    if (SaveCheckerService.lastSavedDateTime === '') {
      return 'All changes saved';
    }
    return 'Last change saved at ' + SaveCheckerService.lastSavedDateTime;
  }, []);

  return (
    <>
      <header className="team-header">
        <div className="left-content">
          <Link to="/" className="logo-link">
            <img
              src={theme === Theme.DARK ? logoLight : logoDark}
              className="logo"
              title="RetroQuest"
              alt="RetroQuest"
            />
          </Link>
          <div className="horizontal-separator" />
          <div className="team-name">{teamName}</div>
        </div>

        <nav className="center-content">
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
