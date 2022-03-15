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

import React, { useState } from 'react';

import ActionItemArchives from './ActionItemArchives/ActionItemArchives';
import ArchivesSubheader from './ArchivesSubheader/ArchivesSubheader';
import ThoughtArchives from './ThoughtArchives/ThoughtArchives';

function ArchivesPage(): JSX.Element {
	const [showActionItems, setShowActionItems] = useState<boolean>(false);

	return (
		<div className="archives-page">
			<ArchivesSubheader
				showActionItems={showActionItems}
				setShowActionItems={setShowActionItems}
			/>
			<div className="archives-page-content">
				{showActionItems ? <ActionItemArchives /> : <ThoughtArchives />}
			</div>
		</div>
	);
}

export default ArchivesPage;
