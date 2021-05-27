package com.ford.labs.retroquest.swagger;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springdoc.core.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class SwaggerConfiguration {
    private OpenAPI apiInfo() {
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


