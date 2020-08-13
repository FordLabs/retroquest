package com.ford.labs.retroquest.e2e;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Tag("container")
public class MetricsControllerContainerTest {
    @Value("${com.retroquest.adminUsername}")
    private String adminUser;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeEach
    public void setUp() {
        restTemplate = restTemplate.withBasicAuth(adminUser, adminPassword);
    }

    @Test
    public void getting_team_count_returns_a_success_status() {
        ResponseEntity<Long> response = restTemplate.getForEntity("/api/admin/metrics/team/count", Long.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isZero();
    }

    @Test
    public void getting_feedback_count_returns_success_status() {
        ResponseEntity<Integer> response = restTemplate.getForEntity("/api/admin/metrics/feedback/count", Integer.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isZero();
    }

    @Test
    public void getting_feedback_average_count_returns_success_status() {
        ResponseEntity<Double> response = restTemplate.getForEntity("/api/admin/metrics/feedback/average", Double.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isZero();
    }

    @Test
    public void getting_login_count_returns_success_status() {
        ResponseEntity<Integer> response = restTemplate.getForEntity("/api/admin/metrics/team/logins", Integer.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isZero();
    }
}
