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

import Dialog, { DialogMethods } from '../dialog/Dialog';

import './EndRetroDialog.scss';

function EndRetroDialog(props, ref) {
  return <EndRetroDialogRenderer onSubmit={() => ref.current.hide()} ref={ref} />;
}

type EndRetroDialogRendererProps = {
  onSubmit: () => void;
};

export const EndRetroDialogRenderer = React.forwardRef<DialogMethods, EndRetroDialogRendererProps>((props, ref) => {
  const { onSubmit } = props;

  return (
    <Dialog
      className="end-retro-dialog"
      header="End the retro?"
      subHeader="This will archive all thoughts!"
      buttons={{
        cancel: { text: 'nope' },
        confirm: {
          text: 'yes!',
          onClick: onSubmit,
        },
      }}
      ref={ref}
    />
  );
});

export default React.forwardRef<DialogMethods>(EndRetroDialog);
