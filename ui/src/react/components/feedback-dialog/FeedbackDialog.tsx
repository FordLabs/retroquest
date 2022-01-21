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

import useTeam from '../../hooks/useTeam';
import Feedback from '../../types/Feedback';
import { onChange } from '../../utils/EventUtils';
import Dialog from '../dialog/Dialog';
import FeedbackStars from '../feedback-stars/FeedbackStars';
import Modal, { ModalMethods } from '../modal/Modal';

import './FeedbackDialog.scss';

function FeedbackDialog(props, ref) {
  const { teamId } = useTeam('fake-team-name');

  function hide() {
    ref.current?.hide();
  }

  return (
    <Modal ref={ref}>
      <FeedbackDialogRenderer teamId={teamId} onSubmit={hide} onCancel={hide} />
    </Modal>
  );
}

type FeedbackDialogRendererProps = {
  teamId: string;
  onSubmit: (feedback: Feedback) => void;
  onCancel: () => void;
};

export function FeedbackDialogRenderer(props: FeedbackDialogRendererProps) {
  const { teamId, onSubmit, onCancel } = props;

  const [stars, setStars] = React.useState(0);
  const [comment, setComment] = React.useState<string>('');
  const [userEmail, setUserEmail] = React.useState<string>('');

  function handleSubmit() {
    if (comment) {
      onSubmit({
        teamId,
        stars,
        comment,
        userEmail,
      });
    }
  }

  return (
    <Dialog
      className="feedback-dialog"
      header="feedback"
      subHeader="How can we improve RetroQuest?"
      buttons={{
        cancel: { text: 'cancel', onClick: onCancel },
        confirm: { text: 'send!', onClick: handleSubmit },
      }}
    >
      <FeedbackStars className="section" value={stars} onChange={setStars} />

      <div className="section comments-section">
        <label className="label" htmlFor="comments">
          comments<span className="required-field">*</span>
        </label>
        <textarea id="comments" value={comment} onChange={onChange(setComment)} />
      </div>

      <div className="section feedback-email-section">
        <label className="label" htmlFor="email">
          feedback email
        </label>
        <input id="email" type="text" value={userEmail} onChange={onChange(setUserEmail)} />
      </div>
    </Dialog>
  );
}

export default React.forwardRef<ModalMethods>(FeedbackDialog);
