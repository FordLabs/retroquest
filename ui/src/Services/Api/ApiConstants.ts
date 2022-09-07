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

export const CREATE_TEAM_API_PATH = '/api/team';
export const CHANGE_EMAIL_API_PATH = '/api/email/reset';
export const CHANGE_PASSWORD_API_PATH = '/api/password/reset';
export const LOGIN_API_PATH = `${CREATE_TEAM_API_PATH}/login`;
export const getTeamNameApiPath = (teamId: string) =>
	`${CREATE_TEAM_API_PATH}/${teamId}/name`;

export const CONTRIBUTORS_API_PATH = '/api/contributors';
export const FEEDBACK_API_PATH = '/api/feedback/';

export const getCSVApiPath = (teamId: string) => `/api/team/${teamId}/csv`;

export const getThoughtApiPath = (teamId: string) =>
	`/api/team/${teamId}/thought`;

export const getActionItemApiPath = (teamId: string) =>
	`/api/team/${teamId}/action-item`;

export const getArchiveRetroApiPath = (teamId: string) =>
	`/api/team/${teamId}/end-retro`;
