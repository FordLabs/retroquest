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
import React, { forwardRef } from 'react';

import Dialog from '../dialog/Dialog';
import Modal, { ModalMethods } from '../modal/Modal';

import './ArchiveRetroDialog.scss';

function ArchiveRetroDialog(props, ref) {
  function hide() {
    ref.current?.hide();
  }

  return (
    <Modal ref={ref}>
      <ArchiveRetroDialogRenderer onSubmit={hide} onCancel={hide} />
    </Modal>
  );
}

type ArchiveRetroDialogRendererProps = {
  onSubmit: () => void;
  onCancel: () => void;
};

export function ArchiveRetroDialogRenderer(props: ArchiveRetroDialogRendererProps) {
  const { onSubmit, onCancel } = props;

  return (
    <Dialog
      className="archive-retro-dialog"
      header="End the retro?"
      subHeader="This will archive all thoughts!"
      buttons={{
        cancel: { text: 'nope', onClick: onCancel },
        confirm: { text: 'yes!', onClick: onSubmit },
      }}
    />
  );
}

export default forwardRef<ModalMethods>(ArchiveRetroDialog);
