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

function ErrorStopSignIcon({ color, className }: Props) {
	return (
		<svg
			role="presentation"
			width="36"
			height="35"
			viewBox="0 0 36 35"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M30.3812 29.8812C33.5484 26.7139 35.5 22.3312 35.5 17.5C35.5 12.6688 33.5483 8.28631 30.3812 5.11884C27.2139 1.95161 22.8312 0 18 0C13.1688 0 8.78631 1.95167 5.61884 5.11884C2.45161 8.28607 0.5 12.6688 0.5 17.5C0.5 22.3312 2.45167 26.7137 5.61884 29.8812C8.78607 33.0484 13.1688 35 18 35C22.8312 35 27.2137 33.0483 30.3812 29.8812ZM20.3675 24.2506C20.3675 22.9388 19.3118 21.8832 18.0001 21.8832C16.6883 21.8832 15.6006 22.9388 15.6006 24.2506C15.6006 25.5623 16.6883 26.65 18.0001 26.65C19.3119 26.65 20.3675 25.5624 20.3675 24.2506ZM18.0001 19.4837C17.1363 19.4837 16.4964 18.7799 16.4004 17.8841L15.6006 10.7498C15.4727 9.50199 16.7844 8.35038 18.0001 8.35038C19.2159 8.35038 20.5274 9.50224 20.3675 10.7498L19.5997 17.8841C19.5037 18.7799 18.8639 19.4837 18.0001 19.4837Z"
				fill={color}
				data-testid="errorStopSignIcon"
			/>
		</svg>
	);
}

export default ErrorStopSignIcon;
