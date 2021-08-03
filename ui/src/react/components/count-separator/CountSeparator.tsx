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

import './CountSeparator.scss';

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
}

export function CountSeparator(props: SeparatorProps): React.ReactElement {
  const { count, ...divProps } = props;
  return (
    <div {...divProps} className="count-separator">
      <span className="separator left-count-separator" />
      <span className="count-value">{count}</span>
      <span className="separator right-count-separator" />
    </div>
  );
}
