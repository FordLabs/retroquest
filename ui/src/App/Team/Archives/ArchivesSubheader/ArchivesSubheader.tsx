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
import LinkTertiary from 'Common/LinkTertiary/LinkTertiary';

import './ArchivesSubheader.scss';

function ArchivesSubheader(): JSX.Element {
	// const setArchivedBoardState = useSetRecoilState(ArchivedBoardState);

	// function handleThoughtsClick(): void {
	// 	setArchivedBoardState(null);
	// }

	return (
		<div className="archives-subheader">
			<ul className="archives-subheader-links">
				<li>
					<LinkTertiary to="thoughts">Thoughts</LinkTertiary>
					{/*<ButtonSubheader*/}
					{/*	className={classNames({*/}
					{/*		active: !showActionItems,*/}
					{/*	})}*/}
					{/*	onClick={handleThoughtsClick}*/}
					{/*>*/}
					{/*	Thoughts*/}
					{/*</ButtonSubheader>*/}
				</li>
				<li>
					<LinkTertiary to="action-items">Action Items</LinkTertiary>
					{/*<ButtonSubheader*/}
					{/*	className={classNames({*/}
					{/*		active: showActionItems,*/}
					{/*	})}*/}
					{/*	onClick={() => setShowActionItems(true)}*/}
					{/*>*/}
					{/*	Action Items*/}
					{/*</ButtonSubheader>*/}
				</li>
			</ul>
		</div>
	);
}

export default ArchivesSubheader;
