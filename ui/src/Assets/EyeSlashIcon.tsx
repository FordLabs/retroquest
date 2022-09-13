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
			width="641"
			height="513"
			viewBox="0 0 641 513"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				data-testid="eyeSlashIcon"
				d="M38.8056 5.10562C28.4056 -3.09438 13.3056 -1.19438 5.10562 9.20562C-3.09438 19.6056 -1.19438 34.7056 9.20562 42.9056L601.206 506.906C611.606 515.106 626.706 513.206 634.906 502.806C643.106 492.406 641.206 477.306 630.806 469.106L525.606 386.706C565.206 346.106 592.006 300.606 605.506 268.306C608.806 260.406 608.806 251.606 605.506 243.706C590.606 208.006 559.306 156.006 512.506 112.606C465.506 68.8056 400.806 32.0056 320.006 32.0056C251.806 32.0056 195.006 58.3056 150.706 92.8056L38.8056 5.10562ZM223.106 149.506C248.606 126.206 282.706 112.006 320.006 112.006C399.506 112.006 464.006 176.506 464.006 256.006C464.006 280.906 457.706 304.306 446.606 324.706L408.006 294.506C413.206 282.706 416.006 269.706 416.006 256.006C416.006 203.006 373.006 160.006 320.006 160.006C317.206 160.006 314.406 160.106 311.606 160.406C316.906 169.706 320.006 180.506 320.006 192.006C320.006 202.206 317.606 211.806 313.406 220.306L223.106 149.506V149.506ZM446.206 447.506L373.006 389.906C356.606 396.406 338.706 400.006 320.006 400.006C240.506 400.006 176.006 335.506 176.006 256.006C176.006 249.106 176.506 242.406 177.406 235.806L83.1056 161.506C60.3056 191.206 44.0056 220.806 34.5056 243.706C31.2056 251.606 31.2056 260.406 34.5056 268.306C49.4056 304.006 80.7056 356.006 127.506 399.406C174.506 443.206 239.206 480.006 320.006 480.006C367.806 480.006 409.906 467.106 446.206 447.506Z"
				fill={color}
			/>
		</svg>
	);
}

export default EyeSlashIcon;
