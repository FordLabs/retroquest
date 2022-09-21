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

import { Link } from 'react-router-dom';
import AuthTemplate from 'Common/AuthTemplate/AuthTemplate';
import { PASSWORD_RESET_PATH } from 'RouteConstants';

function ExpiredLinkPage() {
	return (
		<AuthTemplate header="Expired Link">
			<p>
				For your safety, our password reset link is only valid for 10 minutes.
			</p>
			<p>Fear not! Click here to request a fresh, new reset link.</p>
			<Link to={PASSWORD_RESET_PATH}>Reset my Password</Link>
		</AuthTemplate>
	);
}

export default ExpiredLinkPage;
