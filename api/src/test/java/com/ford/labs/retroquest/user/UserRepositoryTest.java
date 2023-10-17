package com.ford.labs.retroquest.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class UserRepositoryTest {
    @Autowired
    private UserRepository subject;

    @Test
    void save_storesUser() {
        subject.saveAndFlush(new User("User ID"));
        var actual = subject.findById("User ID").orElseThrow();
        assertThat(actual.getId()).isEqualTo("User ID");
    }
}