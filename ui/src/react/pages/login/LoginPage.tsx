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
import { Link, useHistory, useParams } from 'react-router-dom';

import Form from '../../components/form/Form';
import InputText from '../../components/input-text/InputText';
import AuthTemplate from '../../templates/auth/AuthTemplate';
import { validatePassword, validateTeamName } from '../../utils/StringUtils';
import { onChange } from '../../utils/EventUtils';
import TeamService from '../../services/TeamService';

export function LoginPage() {
  const history = useHistory();
  const { teamId } = useParams<{ teamId: string }>();
  const [teamName, setTeamName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [validate, setValidate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState([]);

  React.useEffect(() => {
    TeamService.getTeamName(teamId).then((teamName) => {
      setTeamName(teamName);
    });
  });

  const teamNameErrorMessage = validateTeamName(teamName);
  const passwordErrorMessage = validatePassword(password);

  function submit() {
    setValidate(true);

    if (teamNameErrorMessage || passwordErrorMessage) {
      const errors = [];
      if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
      if (passwordErrorMessage) errors.push(passwordErrorMessage);
      setErrorMessages(errors);
    } else {
      setLoading(true);
      TeamService.login(teamName, password)
        .then((location) => history.push(`/team/${location}`))
        .catch()
        .finally(() => setLoading(false));
    }
  }

  return (
    <AuthTemplate header="Sign in to your Team!" subHeader={<Link to="/create">or create a new team</Link>}>
      <Form onSubmit={submit} errorMessages={errorMessages} submitButtonText="Sign in">
        <InputText
          id="teamName"
          label="Team name"
          value={teamName}
          onChange={onChange(setTeamName)}
          validationMessage="Names must not contain special characters. "
          invalid={validate && !!teamNameErrorMessage}
          readOnly={loading}
        />
        <InputText
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={onChange(setPassword)}
          validationMessage="8 or more characters with a mix of numbers and letters"
          invalid={validate && !!passwordErrorMessage}
          readOnly={loading}
        />
      </Form>
    </AuthTemplate>
  );
}
