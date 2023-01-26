package com.ford.labs.retroquest.database;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import javax.sql.DataSource;
import java.io.File;
import java.io.IOException;

@Profile("postgres_ssl")
@Configuration
public class DatabaseConfiguration {

    @Value("${database.baseUrl}")
    private String baseUrl;
    @Value("${database.username}")
    private String username;
    @Value("${database.password}")
    private String password;
    @Value("${database.encodedSslPassword}")
    private String sslPassword;
    @Value("${database.sslCert}")
    private String sslCert;
    @Value("${database.sslKey}")
    private String sslKey;

    @Bean
    public DataSource getDataSource() throws IOException {
        Resource certResource = new ClassPathResource(sslCert);
        File certFile = certResource.getFile();
        Resource keyResource = new ClassPathResource(sslKey);
        File keyFile = keyResource.getFile();

        String url = baseUrl
                + "?sslMode=require"
                + "&sslcert=" + certFile.getPath()
                + "&sslkey=" + keyFile.getPath()
                + "&sslpassword=" + sslPassword;
        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }}