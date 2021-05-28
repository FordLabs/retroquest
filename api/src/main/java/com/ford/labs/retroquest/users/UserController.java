package com.ford.labs.retroquest.users;

import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.statuscodeexceptions.BadRequestException;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import com.ford.labs.retroquest.team.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping(value = "/api")
@Tag(name = "User Controller", description = "The controller that manages a user")
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
    @Operation(summary = "Creates a new user", description = "requires a non-blank name and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
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
    @Operation(summary = "validates a user given a name", description = "this has no implementation")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK")
    })
    public void validateUser(@PathVariable("name") String name) {
        // For Sonarqube
    }

    @PutMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    @Operation(summary = "adds a given user to an existing team", description = "addUserToExistingTeam")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "400", description = "Team does not exist or the password for the team in the request is invalid"),
            @ApiResponse(responseCode = "409", description = "The user already belongs to the existing team")
    })
    public ResponseEntity<Void> addUserToExistingTeam(@PathVariable("name") String name, @RequestBody ExistingTeamRequest request) {

        Optional<Team> team = teamRepository.findTeamByNameIgnoreCase(request.getName());
        if (team.isPresent() && passwordEncoder.matches(request.getPassword(), team.get().getPassword())) {
            User foundUser = userRepository.findByName(name).orElse(null);

            Set<Team> userTeams = Objects.requireNonNull(foundUser).getTeams();

            if (userTeams.contains(team.get())) {
                return ResponseEntity.status(CONFLICT).build();
            }

            userTeams.add(team.get());

            userRepository.save(foundUser);

            return ResponseEntity.status(CREATED).build();
        }

        throw new BadRequestException();
    }

    @PostMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    @Operation(summary = "Adds a given user to a new team", description = "requires a non-blank name")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request")
    })
    public ResponseEntity<Void> addUserToNewTeam(@PathVariable("name") String name, @RequestBody NewTeamRequest request) {

        if (request != null && !request.getName().isEmpty()) {
            User foundUser = userRepository.findByName(name).orElse(null);

            Team createdTeam = teamService.createNewTeam(request.getName());

            Set<Team> userTeams = Objects.requireNonNull(foundUser).getTeams();
            userTeams.add(createdTeam);

            userRepository.save(foundUser);

            return ResponseEntity.status(CREATED).build();
        }

        throw new BadRequestException();
    }

    @GetMapping(value = "user/{name}/team")
    @PreAuthorize("#name.toLowerCase() == authentication.principal")
    @Transactional
    @Operation(summary = "Returns all of teams assigned to a given user", description = "getTeamsAssignedToUser")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Created")
    })
    public ResponseEntity<Set<Team>> getTeamsAssignedToUser(@PathVariable("name") String name) {

        User foundUser = userRepository.findByName(name).orElse(new User());

        return ResponseEntity.ok(Optional.ofNullable(foundUser.getTeams()).orElse(new HashSet<>()));
    }

    @PostMapping(value = "user/login")
    @Transactional
    @Operation(summary = "Returns a token for a new user", description = "getUserToken")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
            @ApiResponse(responseCode = "404", description = "User Not Found")
    })
    public ResponseEntity<String> getUserToken(@RequestBody NewUserRequest newUserRequest) {

        User foundUser = userRepository.findByName(newUserRequest.getName()).orElse(null);

        if (foundUser != null && passwordEncoder.matches(newUserRequest.getPassword(), foundUser.getPassword())) {
            return ResponseEntity.ok(jwtBuilder.buildJwt(foundUser.getName()));
        }

        return new ResponseEntity<>(jwtBuilder.buildJwt(null), null, HttpStatus.NOT_FOUND);

    }
}
