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

import { onChange } from '../../utils/EventUtils';
import Input from '../input/Input';

type Props = {
  teamName: string;
  onTeamNameInputChange: (updatedTeamName: string) => void;
  invalid?: boolean;
  readOnly?: boolean;
};

export default function InputTeamName(props: Props) {
  const { teamName, onTeamNameInputChange, invalid, readOnly } = props;

  return (
    <Input
      id="teamNameInput"
      label="Team name"
      value={teamName}
      onChange={onChange(onTeamNameInputChange)}
      validationMessage="Names must not contain special characters."
      invalid={invalid}
      readOnly={readOnly}
    />
  );
}
