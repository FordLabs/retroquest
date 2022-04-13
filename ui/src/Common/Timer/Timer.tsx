/*
 * Copyright (c) 2022. Ford Motor Company
 *  All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import pauseButton from '../../Assets/pause-icon.svg';
import playButton from '../../Assets/play-icon.svg';
import resetButton from '../../Assets/x-icon.svg';

import './Timer.scss';

enum TimerOption {
	// THIRTY_SECONDS = 30,
	// ONE_MINUTE = 60,
	FIVE_MINUTES = 300,
	// TEN_MINUTES = 600,
}

function Timer(): JSX.Element {
	const [timerRunning, setTimerRunning] = useState<boolean>(false);
	const [currentTimerOption] = useState<TimerOption>(TimerOption.FIVE_MINUTES);
	const [secondsLeft, setSecondsLeft] = useState<number>(
		TimerOption.FIVE_MINUTES
	);

	const decrementTime = useCallback(() => {
		setSecondsLeft((currentSecondsLeft) => currentSecondsLeft - 1);
	}, []);

	useEffect(() => {
		if (timerRunning) {
			const id = setInterval(decrementTime, 1000);
			return () => clearInterval(id);
		}
	}, [timerRunning, decrementTime]);

	function handlePlayPressed() {
		setTimerRunning(true);
	}

	function handlePausePressed() {
		setTimerRunning(false);
	}

	function handleResetPressed() {
		setTimerRunning(false);
		setSecondsLeft(currentTimerOption);
	}

	return (
		<div className="timer">
			<div className="timer-seconds">
				{moment(secondsLeft * 1000).format('mm:ss')}
			</div>
			{timerRunning ? (
				<button onClick={handlePausePressed} className="pause-button">
					<img src={pauseButton} alt="Pause timer" />
				</button>
			) : (
				<button onClick={handlePlayPressed} className="start-button">
					<img src={playButton} alt="Start timer" />
				</button>
			)}
			<button onClick={handleResetPressed} className="reset-button">
				<img src={resetButton} alt="Reset timer" />
			</button>
		</div>
	);
}

export default Timer;
