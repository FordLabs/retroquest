/*
 * Copyright (c) 2021 Ford Motor Company
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

package com.ford.labs.retroquest.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class SwaggerConfiguration {
    @Bean
    public OpenAPI apiInfo() {
        return new OpenAPI()
            .info(
                new Info().title("RetroQuest")
                    .description("The Swagger API for Retroquest")
                    .version("1.0.0")
                    .contact(new Contact().name("FordLabs").url("https://fordlabs.com/"))
                    .license(new License().name("Apache 2.0").url("http://www.apache.org/licenses/LICENSE-2.0"))
                    .termsOfService("http://tos.ford.com")
            );
    }
}


