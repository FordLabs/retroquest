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

package com.ford.labs.retroquest.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationProvider jwtAuthenticationProvider;

    @Value("${com.retroquest.adminUsername}")
    private String adminUsername;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    @Value("${com.retroquest.requirehttps}")
    private boolean requireHttps;

    @Autowired
    public WebSecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, JwtAuthenticationProvider jwtAuthenticationProvider) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationProvider = jwtAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        if (requireHttps) {
            httpSecurity.requiresChannel().antMatchers("/*").requiresSecure();
        }

        httpSecurity.authorizeRequests().antMatchers("/api/admin/**")
                .hasRole("ADMIN").and().httpBasic();

        httpSecurity
                .authorizeRequests()
                .antMatchers("/contributors").permitAll()
                .antMatchers("/**")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and().addFilterAfter(jwtAuthenticationFilter, BasicAuthenticationFilter.class);

        httpSecurity.csrf().disable();
        displayH2ConsoleToDevs(httpSecurity);
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(jwtAuthenticationProvider);
        auth.inMemoryAuthentication().withUser(adminUsername).password(passwordEncoder().encode(adminPassword)).roles("ADMIN");
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring().antMatchers("/api/team/**/captcha");
    }

    private void displayH2ConsoleToDevs(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.headers().frameOptions().sameOrigin();
    }
}
