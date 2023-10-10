package com.ford.labs.retroquest.user;

import org.springframework.stereotype.Service;

import java.util.HashSet;

import static java.util.Collections.emptySet;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getOrCreateUser(String id) {
        return userRepository.findById(id)
            .orElseGet(() -> userRepository.save(new User(id)));
    }
}
