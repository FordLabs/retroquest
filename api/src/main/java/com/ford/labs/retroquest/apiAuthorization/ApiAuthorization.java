package com.ford.labs.retroquest.apiAuthorization;

import com.ford.labs.retroquest.users.User;
import com.ford.labs.retroquest.users.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ApiAuthorization {

    private final UserRepository userRepository;

    public ApiAuthorization(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean requestIsAuthorized(Authentication authentication, String teamId) {
        return teamId.equals(authentication.getPrincipal()) || teamBelongsToUser(authentication, teamId);

    }

    private boolean teamBelongsToUser(Authentication authentication, String teamId) {
        Optional<User> foundUser = userRepository.findByName(authentication.getPrincipal().toString());
        if (foundUser.isPresent()) {
            return foundUser.get().getTeams()
                    .stream()
                    .anyMatch(team -> team.getId().equals(teamId));
        }

        return false;
    }

}
