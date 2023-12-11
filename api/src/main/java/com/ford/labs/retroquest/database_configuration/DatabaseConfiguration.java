package com.ford.labs.retroquest.database_configuration;

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

@Configuration
@Profile("gcp")
public class DatabaseConfiguration {

    private final String dbHost;
    private final String dbPort;
    private final String dbName;
    private final String username;
    private final String password;


    public DatabaseConfiguration(
            @Value("${database.dbHost}") final String dbHost,
            @Value("${database.dbPort}") final String dbPort,
            @Value("${database.dbName}") final String dbName,
            @Value("${database.username}") final String username,
            @Value("${database.password}") final String password
    ) {
        this.dbHost = dbHost;
        this.dbPort = dbPort;
        this.dbName = dbName;
        this.username = username;
        this.password = password;
    }

    @Bean
    public DataSource getDataSource() throws IOException {

        Resource certResource = new ClassPathResource("client_cert.pem");
        File certFile = certResource.getFile();
        Resource keyResource = new ClassPathResource("private_key.pkcs8");
        File keyFile = keyResource.getFile();

        String url = "jdbc:postgresql://" + dbHost + ":" + dbPort + "/" + dbName
                + "?sslMode=require"
                + "&sslcert=" + certFile.getPath()
                + "&sslkey=" + keyFile.getPath();

        return DataSourceBuilder.create()
                .url(url)
                .username(username)
                .password(password)
                .driverClassName("org.postgresql.Driver")
                .build();
    }
}
