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

interface Props {
	color: string;
}

function EyeSlashIcon({ color }: Props) {
	return (
		<svg
			role="presentation"
			width="577"
			height="448"
			viewBox="0 0 577 448"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				data-testid="eyeOpenIcon"
				d="M287.975 0C207.175 0 142.475 36.8 95.375 80.6C48.575 124 17.275 176 2.475 211.7C-0.825 219.6 -0.825 228.4 2.475 236.3C17.275 272 48.575 324 95.375 367.4C142.475 411.2 207.175 448 287.975 448C368.775 448 433.475 411.2 480.575 367.4C527.375 323.9 558.675 272 573.575 236.3C576.875 228.4 576.875 219.6 573.575 211.7C558.675 176 527.375 124 480.575 80.6C433.475 36.8 368.775 0 287.975 0ZM431.975 224C431.975 303.5 367.475 368 287.975 368C208.475 368 143.975 303.5 143.975 224C143.975 144.5 208.475 80 287.975 80C367.475 80 431.975 144.5 431.975 224ZM287.975 160C287.975 195.3 259.275 224 223.975 224C212.475 224 201.675 221 192.375 215.6C192.175 218.4 191.975 221.1 191.975 224C191.975 277 234.975 320 287.975 320C340.975 320 383.975 277 383.975 224C383.975 171 340.975 128 287.975 128C285.175 128 282.375 128.1 279.575 128.4C284.875 137.7 287.975 148.5 287.975 160Z"
				fill={color}
			/>
		</svg>
	);
}

export default EyeSlashIcon;
