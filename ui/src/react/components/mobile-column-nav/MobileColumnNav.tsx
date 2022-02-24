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
import classNames from 'classnames';

import { ColumnTitle } from '../../types/ColumnTitle';

import './MobileColumnNav.scss';

interface Props {
  columnTitles: ColumnTitle[];
  selectedIndex: number;
  setSelectedIndex(index: number): void;
}

function MobileColumnNav(props: Props): JSX.Element {
  const { columnTitles, selectedIndex, setSelectedIndex } = props;

  const isSelectedIndex = (index: number): boolean => index === selectedIndex;

  const actionItemIndex = columnTitles.length;

  return (
    <div className="mobile-column-nav">
      {columnTitles.map(({ title, topic }: ColumnTitle, index) => {
        return (
          <button
            key={`mobile-column-nav-item-${index}`}
            className={classNames(`nav-button ${topic}-nav-button`, { selected: isSelectedIndex(index) })}
            onClick={() => setSelectedIndex(index)}
          >
            {title + ' Column'}
          </button>
        );
      })}
      <button
        className={classNames('nav-button action-nav-button', { selected: isSelectedIndex(actionItemIndex) })}
        onClick={() => setSelectedIndex(actionItemIndex)}
      >
        Action Items Column
      </button>
    </div>
  );
}

export default MobileColumnNav;
