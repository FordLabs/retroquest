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

export const CREATE_TEAM_PAGE_PATH = '/create';
export const LOGIN_PAGE_PATH = '/login';
export const getLoginPagePathWithTeamId = (teamId: string) => `${LOGIN_PAGE_PATH}/${teamId}`;

export const TEAM_PAGE_ROOT = '/team';
export const getRetroPagePathWithTeamId = (teamId: string) => `${TEAM_PAGE_ROOT}/${teamId}`;
export const getArchivesPagePathWithTeamId = (teamId: string) => `${TEAM_PAGE_ROOT}/${teamId}/archives`;
export const getRadiatorPagePathWithTeamId = (teamId: string) => `${TEAM_PAGE_ROOT}/${teamId}/radiator`;
