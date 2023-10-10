package com.ford.labs.retroquest.user;

import org.junit.jupiter.api.Test;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserServiceTest {

    private final UserRepository mockUserRepository = mock(UserRepository.class);
    private final UserService userService = new UserService(mockUserRepository);

    @Test
    void getOrCreateUser_WithExistingUser_ReturnsUser() {
        var expectedUser = new User("This is an ID", new HashSet<>());
        when(mockUserRepository.findById("This is an ID")).thenReturn(Optional.of(expectedUser));
        var actual = userService.getOrCreateUser("This is an ID");
        assertThat(actual).isEqualTo(expectedUser);
    }

    @Test
    void getOrCreateUser_WithNoExistingUser_ReturnsNewlyCreatedUser() {
        var expectedUser = new User("This is an ID", new HashSet<>());
        when(mockUserRepository.findById("This is an ID")).thenReturn(Optional.empty());
        when(mockUserRepository.save(new User("This is an ID"))).thenReturn(expectedUser);

        var actual = userService.getOrCreateUser("This is an ID");

        assertThat(actual).isEqualTo(expectedUser);
    }
}