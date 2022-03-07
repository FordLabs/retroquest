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

import React from 'react';

import './UpvoteCount.scss';

interface Props {
  votes: number;
}

function UpvoteCount({ votes }: Props): JSX.Element {
  return (
    <div className="upvote-count">
      <div className="star-icon">
        <i className="fas fa-star" aria-hidden="true" />
        <span className="star-shadow" />
      </div>
      <div className="star-count">{votes}</div>
    </div>
  );
}

export default UpvoteCount;
