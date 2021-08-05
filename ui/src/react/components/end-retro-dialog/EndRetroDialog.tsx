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

import Modal, { ModalMethods } from '../modal/Modal';
import Dialog from '../dialog/Dialog';

import './EndRetroDialog.scss';

function EndRetroDialog(props, ref) {
  function hide() {
    ref.current?.hide();
  }

  return (
    <Modal ref={ref}>
      <EndRetroDialogRenderer onSubmit={hide} onCancel={hide} />
    </Modal>
  );
}

type EndRetroDialogRendererProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

export function EndRetroDialogRenderer(props: EndRetroDialogRendererProps) {
  const { onSubmit, onCancel } = props;

  return (
    <Dialog
      className="end-retro-dialog"
      header="End the retro?"
      subHeader="This will archive all thoughts!"
      buttons={{
        cancel: { text: 'nope', onClick: onCancel },
        confirm: { text: 'yes!', onClick: onSubmit },
      }}
    />
  );
}

export default React.forwardRef<ModalMethods>(EndRetroDialog);
