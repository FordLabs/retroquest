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
import { useState } from 'react';

import Form from '../../components/form/Form';
import InputText from '../../components/input-text/InputText';
import TeamService from '../../services/TeamService';
import AuthTemplate from '../../templates/auth/AuthTemplate';
import { onChange } from '../../utils/EventUtils';
import { validateConfirmationPassword, validatePassword, validateTeamName } from '../../utils/StringUtils';

interface Props {
  routeTo?: (string) => void;
}

export default function CreatePage(props: Props): JSX.Element {
  const { routeTo } = props;

  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const teamNameErrorMessage = validateTeamName(teamName);
  const passwordErrorMessage = validatePassword(password);
  const confirmPasswordErrorMessage = validateConfirmationPassword(password, confirmationPassword);

  const captureErrors = () => {
    const errors = [];
    if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
    if (passwordErrorMessage) errors.push(passwordErrorMessage);
    if (confirmPasswordErrorMessage) errors.push(confirmPasswordErrorMessage);
    setErrorMessages(errors);
  };

  function createTeam() {
    TeamService.create(teamName, password)
      .then((teamId) => {
        routeTo(`/team/${teamId}`);
      })
      .catch((error) => {
        let errorMsg = 'Incorrect team name or password. Please try again.';
        const { response } = error;
        if (response.status === 409) {
          errorMsg = typeof response !== 'undefined' ? response.data.message : error.message;
        }
        setErrorMessages([errorMsg]);
      })
      .finally(() => setLoading(false));
  }

  function onSubmit() {
    setValidate(true);
    setErrorMessages([]);

    if (teamNameErrorMessage || passwordErrorMessage || confirmPasswordErrorMessage) {
      captureErrors();
    } else {
      setLoading(true);
      createTeam();
    }
  }

  // @todo convert to Link element once create page is written in react
  const LoginTeamLink = () => (
    <a className="create-page-link" href="/login" data-testid="goToLoginPageLink">
      or sign in to your existing board
    </a>
  );

  return (
    <AuthTemplate header="Create a new Team!" subHeader={<LoginTeamLink />}>
      <Form onSubmit={onSubmit} errorMessages={errorMessages} submitButtonText="Create Team">
        <InputText
          id="teamNameInput"
          label="Team name"
          value={teamName}
          onChange={onChange((updatedTeamName: string) => {
            setTeamName(updatedTeamName);
            setErrorMessages([]);
          })}
          validationMessage="Names must not contain special characters."
          invalid={validate && !!teamNameErrorMessage}
          readOnly={loading}
        />
        <InputText
          id="passwordInput"
          label="Password"
          type="password"
          value={password}
          onChange={onChange((updatedPassword: string) => {
            setPassword(updatedPassword);
            setErrorMessages([]);
          })}
          validationMessage="8 or more characters with a mix of numbers and letters"
          invalid={validate && !!passwordErrorMessage}
          readOnly={loading}
        />
        <InputText
          id="confirmPasswordInput"
          label="Confirm Password"
          type="password"
          value={confirmationPassword}
          onChange={onChange((updatedPassword: string) => {
            setConfirmationPassword(updatedPassword);
            setErrorMessages([]);
          })}
          invalid={validate && !!confirmPasswordErrorMessage}
          readOnly={loading}
        />
      </Form>
    </AuthTemplate>
  );
}
