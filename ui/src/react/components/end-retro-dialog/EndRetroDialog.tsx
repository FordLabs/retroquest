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

import { PrimaryButton, SecondaryButton } from '../button/Button';
import useDialog from '../../hooks/useDialog';
import Dialog from '../../types/dialog';

import './EndRetroDialog.scss';

function EndRetroDialog(props, ref) {
  const [show, setShow] = useDialog(ref);

  return show ? <EndRetroDialogRenderer onSubmit={() => undefined} onHide={() => setShow(false)} /> : null;
}

type EndRetroDialogRendererProps = {
  onSubmit: () => void;
  onHide: () => void;
};

export function EndRetroDialogRenderer(props: EndRetroDialogRendererProps) {
  const { onSubmit, onHide } = props;

  return (
    <div className="end-retro-dialog" onClick={onHide} data-testid="dialogBackdrop">
      <div className="dialog" onClick={(event) => event.stopPropagation()}>
        <div className="content-area">
          <div className="heading">Do you want to end the retro?</div>
          <div className="sub-heading">This will archive all thoughts!</div>
        </div>
        <div className="footer">
          <div className="container" id="cancel-button-container">
            <SecondaryButton onClick={onHide}>nope</SecondaryButton>
          </div>
          <div className="container" id="end-button-container">
            <PrimaryButton onClick={onSubmit}>yes!</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef<Dialog>(EndRetroDialog);
