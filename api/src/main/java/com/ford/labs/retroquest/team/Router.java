/*
 * Copyright © 2018 Ford Motor Company
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

package com.ford.labs.retroquest.team;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class Router {

    @Autowired
    private TeamRepository repository;

    @GetMapping(value = "/team")
    public String index(@RequestParam("teamId") String teamId) {
        Team team = repository.findOne(teamId.toLowerCase());

        if (team == null) {
            return "app/invalidTeam.html";
        }

        if(team.getPassword() == null){
           return "redirect:/set-password?teamId=" + teamId;
        }

        return "app/app.html";
    }

    @GetMapping(value = "/login")
    public String login(){
        return "login/index.html";
    }

    @GetMapping(value = "/set-password")
    public String setPassword(@RequestParam("teamId") String teamId) {
        Team team = repository.findOne(teamId.toLowerCase());
        if(team == null) {
            return "app/invalidTeam.html";
        }

        return "app/setPassword.html";
    }
}
