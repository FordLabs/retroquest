package com.fordfacto.fordfactoweb.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
@Order(1)
public class BasicAuthConfig extends WebSecurityConfigurerAdapter {

    @Value("${com.retroquest.adminUsername}")
    private String adminUsername;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .httpBasic().and()
                .authorizeRequests()
                .antMatchers("/api/feedback/all")
                .authenticated();

        httpSecurity.csrf().disable();
        httpSecurity.headers().frameOptions().disable();
    }

    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.inMemoryAuthentication().withUser(adminUsername).password(adminPassword).roles("ADMIN");
    }
}
