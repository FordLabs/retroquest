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
	className?: string;
}

function CheckedCheckboxIcon({ color, className }: Readonly<Props>) {
	return (
		<svg
			role="presentation"
			width="36"
			height="28"
			viewBox="0 0 36 28"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				data-testid="checkedCheckboxIcon"
				d="M24.7049 25.2053H3.29443V3.79482H24.7049V3.79753L27.5 1.00247V1H0.5V28H27.5V14.9658L24.7049 17.7601V25.2053Z"
				fill={color}
			/>
			<path
				d="M31.4035 0L16.9595 14.0395L9.59502 6.8813L5.5 10.862L16.9599 22L35.5 3.98073L31.4035 0Z"
				fill={color}
			/>
		</svg>
	);
}

export default CheckedCheckboxIcon;
