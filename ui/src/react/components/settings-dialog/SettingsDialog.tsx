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
import { forwardRef, useState } from 'react';
import classnames from 'classnames';

import useAuth from '../../hooks/useAuth';
import { PrimaryButton } from '../button/Button';
import Dialog from '../dialog/Dialog';
import Modal, { ModalMethods } from '../modal/Modal';

import StylesTab from './styles-tab/StylesTab';

import './SettingsDialog.scss';

function SettingsDialog(props: unknown, ref: React.Ref<ModalMethods>) {
  return (
    <Modal ref={ref}>
      <SettingsDialogContent />
    </Modal>
  );
}

enum Tabs {
  STYLES = 'styles',
  ACCOUNT = 'account',
}

export function SettingsDialogContent() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tabs>(Tabs.STYLES);

  const stylesTabIsActive = () => tab === Tabs.STYLES;
  const accountTabIsActive = () => tab === Tabs.ACCOUNT;

  return (
    <Dialog className="settings-dialog" header="Settings" subHeader="choose your preferences">
      <div className="tab-container">
        <div className="tab-heading">
          <div className={classnames('tab', { selected: stylesTabIsActive() })} onClick={() => setTab(Tabs.STYLES)}>
            Styles
          </div>
          <div className={classnames('tab', { selected: accountTabIsActive() })} onClick={() => setTab(Tabs.ACCOUNT)}>
            Account
          </div>
        </div>
        {stylesTabIsActive() && <StylesTab />}
        {accountTabIsActive() && (
          <div className="tab-body account-tab-body">
            <PrimaryButton onClick={logout}>Logout</PrimaryButton>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default forwardRef<ModalMethods>(SettingsDialog);
