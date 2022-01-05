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
import InputText from '../../components/input-text/InputText';
import TeamService from '../../services/TeamService';
import AuthTemplate from '../../templates/auth/AuthTemplate';
import { onChange } from '../../utils/EventUtils';
import { validatePassword, validateTeamName } from '../../utils/StringUtils';

interface Props {
  teamId?: string;
  routeTo?: (string) => void;
}

export function LoginPage(props: Props): JSX.Element {
  const { teamId, routeTo } = props;

  // const history = useHistory();
  // const { teamId } = useParams<{ teamId: string }>();
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
      .then((location) => {
        const path = `/team/${location}`;
        // history.push(path);
        routeTo(path);
      })
      .catch(console.error)
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
        <InputText
          id="teamName"
          label="Team name"
          value={teamName}
          onChange={onChange((updatedTeamName: string) => {
            setTeamName(updatedTeamName);
            setErrorMessages([]);
          })}
          validationMessage="Names must not contain special characters. "
          invalid={validate && !!teamNameErrorMessage}
          readOnly={loading}
        />
        <InputText
          id="password"
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
      </Form>
    </AuthTemplate>
  );
}
