package com.ford.labs.retroquest.api;

import com.ford.labs.retroquest.security.JwtBuilder;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.TeamRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"test", "h2"})
public class RoutingTest extends AbstractTransactionalJUnit4SpringContextTests {
    
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtBuilder jwtBuilder;

    @Autowired
    private TeamRepository repository;
    
    @Test
    public void shouldReturnTeamView_givenAnExistingTeamId() throws Exception {
        Team teamEntity = new Team();
        teamEntity.setUri("123");
        teamEntity.setPassword("AM A PASSWORD PLZ BELIV");
        repository.save(teamEntity);

        mockMvc.perform(get("/team?teamId=123")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("123")))
            .andExpect(view().name("app/app.html"));
    }

    @Test
    public void shouldReturn400BadRequest_givenNoTeamId() throws Exception {
        mockMvc.perform(get("/team")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("123")))
            .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnInvalidURLView_givenATeamIdThatDoesNotExist() throws Exception {
        mockMvc.perform(get("/team?teamId=notTaken")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("notTaken")))
            .andExpect(view().name("app/invalidTeam.html"));
    }

    @Test
    public void shouldReturnLoginPage_givenUserTriesToLogIn() throws Exception {
        mockMvc.perform(get("/login"))
            .andExpect(view().name("login/index.html"));
    }

    @Test
    public void shouldReturnSetPasswordPage_givenBoardWithoutPasswordIsAccessed() throws Exception {
        Team teamEntity = new Team();
        teamEntity.setUri("i-am-not-secure");
        repository.save(teamEntity);

        mockMvc.perform(get("/team?teamId=i-am-not-secure")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("i-am-not-secure")))
            .andExpect(view().name("redirect:/set-password?teamId=i-am-not-secure"));
    }

    @Test
    public void shouldReturnSetPasswordPage_givenUserTriesToSetPassword() throws Exception {
        Team teamEntity = new Team();
        teamEntity.setUri("url");
        repository.save(teamEntity);

        mockMvc.perform(get("/set-password?teamId=url"))
                .andExpect(view().name("app/setPassword.html"));
    }

    @Test
    public void shouldReturnInvalidTeamPage_givenUserTriesToSetPasswordForAnUnknownTeam() throws Exception {
        mockMvc.perform(get("/set-password?teamId=not-a-team")
                .header("Authorization", "Bearer " + jwtBuilder.buildJwt("not-a-team")))
            .andExpect(view().name("app/invalidTeam.html"));
    }
}
