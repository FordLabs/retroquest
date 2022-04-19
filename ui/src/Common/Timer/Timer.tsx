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

import React, { useCallback, useEffect, useState } from 'react';
import pauseButton from 'Assets/pause-icon.svg';
import playButton from 'Assets/play-icon.svg';
import resetButton from 'Assets/x-icon.svg';
import moment from 'moment';
import { useSetRecoilState } from 'recoil';

import { ModalContentsState } from '../../State/ModalContentsState';
import Dropdown from '../Dropdown/Dropdown';

import TimesUpDialog from './TimesUpDialog/TimesUpDialog';

import './Timer.scss';

enum TimerOption {
	THIRTY_SECONDS = 30,
	ONE_MINUTE = 60,
	FIVE_MINUTES = 300,
	TEN_MINUTES = 600,
}

enum TimerState {
	PAUSED,
	RUNNING,
	DEFAULT,
}

function Timer(): JSX.Element {
	const setModalContents = useSetRecoilState(ModalContentsState);
	const [timerState, setTimerState] = useState<TimerState>(TimerState.DEFAULT);
	const [currentTimerOption, setCurrentTimerOption] = useState<TimerOption>(
		TimerOption.FIVE_MINUTES
	);
	const [secondsLeft, setSecondsLeft] = useState<number>(
		TimerOption.FIVE_MINUTES
	);

	const getOptions = () => {
		return Object.keys(TimerOption)
			.filter((v) => !isNaN(Number(v)))
			.map((value) => {
				const time = parseInt(value, 10);
				return { label: formatSeconds(time), value: time };
			});
	};

	const formatSeconds = (seconds: number) =>
		moment(seconds * 1000).format('mm:ss');

	const startTimer = () => setTimerState(TimerState.RUNNING);

	const pauseTimer = () => setTimerState(TimerState.PAUSED);

	const resetTimer = useCallback(() => {
		setSecondsLeft(currentTimerOption);
		setTimerState(TimerState.DEFAULT);
	}, [currentTimerOption]);

	const openModal = useCallback(() => {
		setModalContents({
			title: "Time's Up!",
			component: (
				<TimesUpDialog
					onConfirm={() => {
						resetTimer();
						setModalContents(null);
					}}
					onAddTime={() => {
						setSecondsLeft(TimerOption.ONE_MINUTE);
						startTimer();
						setModalContents(null);
					}}
				/>
			),
		});
	}, [resetTimer, setModalContents]);

	useEffect(() => {
		if (timerState === TimerState.RUNNING) {
			const id = setInterval(() => {
				setSecondsLeft((currentSecondsLeft: number) => {
					if (currentSecondsLeft === 0) {
						clearInterval(id);
						return currentSecondsLeft;
					} else {
						return currentSecondsLeft - 1;
					}
				});
			}, 1000);
			return () => clearInterval(id);
		}
	}, [timerState]);

	useEffect(() => {
		if (secondsLeft === 0) {
			setTimerState(TimerState.PAUSED);
			openModal();
		}
	}, [secondsLeft, openModal]);

	return (
		<div className="timer">
			{timerState === TimerState.DEFAULT ? (
				<Dropdown
					label="Timer amount"
					options={getOptions()}
					defaultValue={currentTimerOption}
					onChange={(value) => {
						const time = parseInt(value, 10);
						setSecondsLeft(time);
						setCurrentTimerOption(time);
					}}
				/>
			) : (
				<div className="timer-count-down" data-testid="timerCountDownDisplay">
					<span>{formatSeconds(secondsLeft)}</span>
				</div>
			)}

			{timerState === TimerState.RUNNING ? (
				<button onClick={pauseTimer} className="pause-button">
					<img src={pauseButton} alt="Pause timer" />
				</button>
			) : (
				<button onClick={startTimer} className="start-button">
					<img src={playButton} alt="Start timer" />
				</button>
			)}

			<button onClick={resetTimer} className="reset-button">
				<img src={resetButton} alt="Reset timer" />
			</button>
		</div>
	);
}

export default Timer;
