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

import * as React from 'react';
import { useRef } from 'react';
import fileSaver from 'file-saver';
import { useRecoilValue } from 'recoil';

import ArchiveRetroDialog from '../../../components/archive-retro-dialog/ArchiveRetroDialog';
import FeedbackDialog from '../../../components/feedback-dialog/FeedbackDialog';
import { ModalMethods } from '../../../components/modal/Modal';
import TeamService from '../../../services/api/TeamService';
import { TeamState } from '../../../state/TeamState';

import './RetroSubheader.scss';

function RetroSubheader() {
  const feedbackModalRef = useRef<ModalMethods>();
  const archiveRetroModalRef = useRef<ModalMethods>();

  const team = useRecoilValue(TeamState);

  const downloadCSV = () => {
    TeamService.getCSV(team.id)
      .then((csvData) => fileSaver.saveAs(csvData, `${team.id}-board.csv`))
      .catch(console.error);
  };

  return (
    <>
      <div className="sub-header">
        <ul className="sub-header-links">
          <li>
            <button className="button button-secondary" onClick={() => feedbackModalRef.current?.show()}>
              Give Feedback
            </button>
          </li>
          <li>
            <button className="button button-secondary" onClick={downloadCSV}>
              Download CSV
            </button>
          </li>
          <li>
            <button className="button button-primary" onClick={() => archiveRetroModalRef.current?.show()}>
              Archive Retro
            </button>
          </li>
        </ul>
      </div>
      <FeedbackDialog ref={feedbackModalRef} />
      <ArchiveRetroDialog ref={archiveRetroModalRef} />
    </>
  );
}

export default RetroSubheader;
