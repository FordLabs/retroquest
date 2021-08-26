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

import Contributors from '../../components/contributors/Contributors';
import Logo from '../../components/logo/Logo';

import './AuthTemplate.scss';

type AuthTemplateProps = React.PropsWithChildren<{
  header: React.ReactNode;
  subHeader: React.ReactNode;
}>;

export default function AuthTemplate(props: AuthTemplateProps) {
  const { header, subHeader, children } = props;

  return (
    <div className="auth-template">
      <div className="auth-template-container">
        <Logo />
        <div className="auth-template-header">
          <h2 className="auth-heading">{header}</h2>
          <span className="auth-sub-heading">{subHeader}</span>
        </div>
        <div className="auth-template-content">{children}</div>
        <div className="auth-template-footer">
          <a className="github" target="_blank" rel="noopener" href="https://github.com/FordLabs/retroquest">
            <i className="fab fa-github" aria-hidden="true" />
            <span>Github</span>
          </a>
        </div>
      </div>
      <Contributors />
    </div>
  );
}
