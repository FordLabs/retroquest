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

import React, { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import './TeamHeaderNavLink.scss';

interface Props {
	to: string;
	children: ReactNode;
	// If the end prop is set to true, it will ensure this component isn't matched as "active"
	// when its descendant paths are matched.
	end?: boolean;
}

function TeamHeaderNavLink(props: Props) {
	const { to, children, end } = props;

	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				'team-header-nav-link' + (isActive ? ' selected' : '')
			}
			end={end}
		>
			{children}
		</NavLink>
	);
}

export default TeamHeaderNavLink;
