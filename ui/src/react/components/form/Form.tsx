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
import { ComponentPropsWithoutRef } from 'react';
import classnames from 'classnames';

import { PrimaryButton } from '../button/Button';

import './Form.scss';

interface FormProps extends ComponentPropsWithoutRef<'form'> {
  errorMessages?: string[];
  submitButtonText?: string;
}

export default function Form(props: FormProps): JSX.Element {
  const { submitButtonText = 'submit', errorMessages = [], onSubmit, className, children, ...formProps } = props;
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(e) {
    setLoading(true);
    Promise.resolve(onSubmit(e)).finally(() => setLoading(false));
    e.preventDefault();
  }

  return (
    <form className={classnames('form', className)} onSubmit={handleSubmit} {...formProps}>
      {children}
      {errorMessages.map((errorMessage, index) => (
        <div className="error-message" key={index}>
          {errorMessage}
        </div>
      ))}
      <PrimaryButton className="submit-button" disabled={loading}>
        {submitButtonText}
      </PrimaryButton>
    </form>
  );
}
