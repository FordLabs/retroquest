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

import ColumnHeader from '../../../../../../Common/ColumnHeader/ColumnHeader';
import CountSeparator from '../../../../../../Common/CountSeparator/CountSeparator';
import UpvoteCount from '../../../../../../Common/UpvoteCount/UpvoteCount';
import { Column } from '../../../../../../Types/Column';
import Thought from '../../../../../../Types/Thought';

import './ArchivedBoardColumn.scss';

interface ColumnProps {
	column: Column;
	thoughts: Thought[];
}

interface ThoughtProps {
	thought: Thought;
}

function ArchivedBoardThought({ thought }: ThoughtProps): JSX.Element {
	return (
		<li data-testid={'thought' + thought.id} className="archived-thought">
			<p className="message">{thought.message}</p>
			<div className="archived-thought-footer">
				<UpvoteCount votes={thought.hearts} />
				<p className="is-discussed">
					{thought.discussed ? 'Discussed' : 'Not Discussed'}
				</p>
			</div>
		</li>
	);
}

function ArchivedBoardColumn({ column, thoughts }: ColumnProps): JSX.Element {
	return (
		<div data-testid="archived-column" className="archived-column">
			<ColumnHeader initialTitle={column.title} type={column.topic} />
			<CountSeparator count={thoughts.length} />
			<ol>
				{thoughts.map((thought) => {
					return (
						<ArchivedBoardThought
							key={'thought' + thought.id}
							thought={thought}
						/>
					);
				})}
			</ol>
		</div>
	);
}

export default ArchivedBoardColumn;
