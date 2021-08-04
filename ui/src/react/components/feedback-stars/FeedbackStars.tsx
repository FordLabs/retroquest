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
import classnames from 'classnames';

import './FeedbackStars.scss';

type StarState = boolean;

type Stars = [StarState, StarState, StarState, StarState, StarState];

const EMPTY_STARS: Stars = [false, false, false, false, false];

function starsWith(count: number, newState: StarState): Stars {
  return EMPTY_STARS.map((state, index) => (index < count ? newState : state)) as Stars;
}

type FeedbackStarsProps = {
  value: number;
  onChange: (stars: number) => void;
  className?: string;
};

export default function FeedbackStars(props: FeedbackStarsProps) {
  const { value, onChange, className } = props;
  const [hoverStars, setHoverStars] = React.useState<Stars>(EMPTY_STARS);

  const activeStars = React.useMemo(() => {
    return hoverStars.map((star, index) => (value ? index < value : star));
  }, [hoverStars, value]);

  return (
    <div className={classnames('feedback-stars', className)} onMouseLeave={() => setHoverStars(starsWith(5, false))}>
      {activeStars.map((star, index) => (
        <div
          key={index}
          data-testid={`star${index}`}
          className={classnames('fa-star', star ? 'active fas' : 'far')}
          onMouseEnter={() => setHoverStars(starsWith(index + 1, true))}
          onClick={() => onChange(index + 1)}
        />
      ))}
    </div>
  );
}
