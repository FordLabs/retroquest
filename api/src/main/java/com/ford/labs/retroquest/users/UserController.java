package com.ford.labs.retroquest.users;

import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.statuscodeexceptions.BadRequestException;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping(value = "/api")
public class UserController {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamService teamService;
    private final JwtBuilder jwtBuilder;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository,
                          TeamRepository teamRepository,
                          TeamService teamService,
                          JwtBuilder jwtBuilder,
                          PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamService = teamService;
        this.jwtBuilder = jwtBuilder;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(value = "user")
    @Transactional
    public ResponseEntity<String> createNewUser(@RequestBody NewUserRequest newUserRequest) {

        if (!newUserRequest.getPassword().isEmpty() && !newUserRequest.getName().isEmpty()) {

            String encryptedPassword = passwordEncoder.encode(newUserRequest.getPassword());

            User newUser = User.builder()
                    .name(newUserRequest.getName())
                    .password(encryptedPassword)
                    .build();

            userRepository.save(newUser);

            String jwt = jwtBuilder.buildJwt(newUserRequest.getName());

            MultiValueMap<String, String> headers = new HttpHeaders();
            headers.add("Location", "/user/" + newUserRequest.getName().toLowerCase());

            return new ResponseEntity<>(jwt, headers, CREATED);
        }

        throw new BadRequestException();
    }

    @GetMapping(value = "user/{name}")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    public void validateUser(@PathVariable("name") String name) {

    }

    @PutMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    public ResponseEntity<Void> addExistingTeamToUser(@PathVariable("name") String name, @RequestBody ExistingTeamRequest request) {

        Optional<Team> teamOptional = teamRepository.findTeamByName(request.getName());
        if (teamOptional.isPresent() && passwordEncoder.matches(request.getPassword(), teamOptional.get().getPassword())) {
            User foundUser = userRepository.findByName(name).orElse(null);

            Set<Team> userTeams = foundUser.getTeams();

            if (userTeams.contains(teamOptional.get())) {
                return ResponseEntity.status(CONFLICT).build();
            }

            userTeams.add(teamOptional.get());

            userRepository.save(foundUser);

            return ResponseEntity.status(CREATED).build();
        }

        throw new BadRequestException();
    }

    @PostMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    public ResponseEntity addNewTeamToUser(@PathVariable("name") String name, @RequestBody NewTeamRequest request) {

        if (request != null && !request.getName().isEmpty()) {
            User foundUser = userRepository.findByName(name).orElse(null);

            Team createdTeam = teamService.createNewTeam(request.getName());

            Set<Team> userTeams = foundUser.getTeams();
            userTeams.add(createdTeam);

            userRepository.save(foundUser);

            return ResponseEntity.status(CREATED).build();
        }

        throw new BadRequestException();
    }

    @GetMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    public ResponseEntity<Set<Team>> getTeamsAssignedToUser(@PathVariable("name") String name) {

        User foundUser = userRepository.findByName(name).orElse(null);

        return ResponseEntity.ok(foundUser.getTeams());
    }

    @PostMapping(value = "user/login")
    @Transactional
    public ResponseEntity<String> getUserToken(@RequestBody NewUserRequest newUserRequest) {

        User foundUser = userRepository.findByName(newUserRequest.getName()).orElse(null);

        if (foundUser != null && passwordEncoder.matches(newUserRequest.getPassword(), foundUser.getPassword())) {
            return ResponseEntity.ok(jwtBuilder.buildJwt(foundUser.getName()));
        }

        return new ResponseEntity<>(jwtBuilder.buildJwt(null), null, HttpStatus.NOT_FOUND);

    }

}
