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
import { useEffect, useState } from 'react';

import Form from '../../components/form/Form';
import InputPassword from '../../components/input-password/InputPassword';
import InputTeamName from '../../components/input-team-name/InputTeamName';
import TeamService from '../../services/TeamService';
import AuthTemplate from '../../templates/auth/AuthTemplate';
import { validatePassword, validateTeamName } from '../../utils/StringUtils';

interface Props {
  teamId?: string;
  routeTo?: (string) => void;
}

export function LoginPage(props: Props): JSX.Element {
  const { teamId, routeTo } = props;

  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');

  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (teamId) {
      TeamService.getTeamName(teamId).then(setTeamName);
    }
  }, [teamId]);

  const teamNameErrorMessage = validateTeamName(teamName);
  const passwordErrorMessage = validatePassword(password);

  const captureErrors = () => {
    const errors = [];
    if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
    if (passwordErrorMessage) errors.push(passwordErrorMessage);
    setErrorMessages(errors);
  };

  const loginTeam = () => {
    TeamService.login(teamName, password)
      .then((_teamId) => {
        routeTo(`/team/${_teamId}`);
      })
      .catch(() => {
        setErrorMessages(['Incorrect team name or password. Please try again.']);
      })
      .finally(() => setLoading(false));
  };

  function submit() {
    setValidate(true);
    setErrorMessages([]);

    if (teamNameErrorMessage || passwordErrorMessage) {
      captureErrors();
    } else {
      setLoading(true);
      loginTeam();
    }
  }

  // @todo convert to Link element once create page is written in react
  const CreateTeamLink = () => (
    <a className="create-page-link" href="/create">
      or create a new team
    </a>
  );

  return (
    <AuthTemplate header="Sign in to your Team!" subHeader={<CreateTeamLink />}>
      <Form onSubmit={submit} errorMessages={errorMessages} submitButtonText="Sign in">
        <InputTeamName
          teamName={teamName}
          onTeamNameInputChange={(updatedTeamName: string) => {
            setTeamName(updatedTeamName);
            setErrorMessages([]);
          }}
          invalid={validate && !!teamNameErrorMessage}
          readOnly={loading}
        />
        <InputPassword
          password={password}
          onPasswordInputChange={(updatedPassword: string) => {
            setPassword(updatedPassword);
            setErrorMessages([]);
          }}
          invalid={validate && !!passwordErrorMessage}
          readOnly={loading}
        />
      </Form>
    </AuthTemplate>
  );
}
