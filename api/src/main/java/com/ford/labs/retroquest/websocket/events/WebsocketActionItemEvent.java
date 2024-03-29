/*
 * Copyright (c) 2022. Ford Motor Company
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

package com.ford.labs.retroquest.websocket.events;

import com.ford.labs.retroquest.actionitem.ActionItem;

public class WebsocketActionItemEvent extends WebsocketEvent{

    private static final String ROUTE_STRING = "/topic/%s/action-items";
    private final String teamId;

    public WebsocketActionItemEvent(String teamId, WebsocketEventType type, ActionItem payload) {
        super(type, payload);
        this.teamId = teamId;
    }

    @Override
    public String getRoute() {
        return String.format(ROUTE_STRING, teamId);
    }
}
