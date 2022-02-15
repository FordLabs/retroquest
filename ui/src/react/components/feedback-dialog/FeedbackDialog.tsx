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
import { useRecoilValue } from 'recoil';

import FeedbackService from '../../services/api/FeedbackService';
import { TeamState } from '../../state/TeamState';
import { onChange } from '../../utils/EventUtils';
import Dialog from '../dialog/Dialog';
import FeedbackStars from '../feedback-stars/FeedbackStars';
import Modal, { ModalMethods } from '../modal/Modal';

import './FeedbackDialog.scss';

function FeedbackDialog(props, ref) {
  const team = useRecoilValue(TeamState);

  function hide() {
    ref.current?.hide();
  }

  return (
    <Modal ref={ref}>
      <FeedbackDialogRenderer teamId={team.id} closeModal={hide} />
    </Modal>
  );
}

type FeedbackDialogRendererProps = {
  teamId: string;
  closeModal: () => void;
};

export function FeedbackDialogRenderer(props: FeedbackDialogRendererProps) {
  const { teamId, closeModal } = props;

  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  function handleSubmit() {
    if (comment) {
      const feedback = {
        teamId,
        stars,
        comment,
        userEmail,
      };
      FeedbackService.addFeedback(feedback)
        .then(() => {
          closeModal();
        })
        .catch(console.error);
    }
  }

  return (
    <Dialog
      testId="feedbackDialog"
      className="feedback-dialog"
      header="Feedback"
      subHeader="How can we improve RetroQuest?"
      buttons={{
        cancel: { text: 'Cancel', onClick: closeModal },
        confirm: { text: 'Send!', onClick: handleSubmit },
      }}
    >
      <FeedbackStars className="section" value={stars} onChange={setStars} />
      <div className="section comments-section">
        <label className="label" htmlFor="comments">
          Comments<span className="required-field">*</span>
        </label>
        <textarea id="comments" value={comment} onChange={onChange(setComment)} />
      </div>
      <div className="section feedback-email-section">
        <label className="label" htmlFor="email">
          Feedback Email
        </label>
        <input id="email" type="text" value={userEmail} onChange={onChange(setUserEmail)} />
      </div>
    </Dialog>
  );
}

export default forwardRef<ModalMethods>(FeedbackDialog);
