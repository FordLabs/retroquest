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
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Form from '../components/form/Form';
import InputText from '../components/input-text/InputText';
import { onChange } from '../utils/EventUtils';
import { validatePassword, validateTeamName } from '../utils/StringUtils';

export default {
  title: 'components/Form',
  component: Form,
} as ComponentMeta<typeof Form>;

const Template: ComponentStory<typeof Form> = () => {
  const [teamName, setTeamName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [validate, setValidate] = React.useState(false);
  const [errorMessages, setErrorMessages] = React.useState([]);

  const teamNameErrorMessage = validateTeamName(teamName);
  const passwordErrorMessage = validatePassword(password);

  function submit(): Promise<void> {
    setValidate(true);

    if (teamNameErrorMessage || passwordErrorMessage) {
      const errors = [];
      if (teamNameErrorMessage) errors.push(teamNameErrorMessage);
      if (passwordErrorMessage) errors.push(passwordErrorMessage);
      setErrorMessages(errors);

      return Promise.resolve();
    } else {
      return new Promise((resolve) => {
        setTimeout(() => {
          setValidate(false);
          setTeamName('');
          setPassword('');
          setErrorMessages([]);
          resolve();
        }, 1000);
      });
    }
  }

  return (
    <Form onSubmit={submit} errorMessages={errorMessages} style={{ maxWidth: '600px' }}>
      <InputText
        id="teamName"
        label="Team name"
        value={teamName}
        onChange={onChange(setTeamName)}
        validationMessage="Names must not contain special characters."
        invalid={validate && !!teamNameErrorMessage}
      />
      <InputText
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={onChange(setPassword)}
        validationMessage="8 or more characters with a mix of numbers and letters"
        invalid={validate && !!passwordErrorMessage}
      />
    </Form>
  );
};

export const Example = Template.bind({});
