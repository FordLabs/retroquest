package com.ford.labs.retroquest.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ford.labs.retroquest.security.JwtBuilder;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.TextCodec;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.xml.bind.DatatypeConverter;
import java.util.Base64;

@AutoConfigureMockMvc
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Ignore
public class ControllerTest {

    @Autowired
    public ObjectMapper objectMapper;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public JwtBuilder jwtBuilder;

    @Value("${com.retroquest.adminUsername}")
    private String adminUsername;

    @Value("${com.retroquest.adminPassword}")
    private String adminPassword;

    @Value("${local.server.port}")
    private int port;

    @Value("${jwt.signing.secret}")
    private String jwtSigningSecret;

    private String basicAuthToken;

    private String bearerAuthToken;

    public String teamId;

    public String websocketUrl;

    @Before
    public void setUp() {
        teamId = "BeachBums";
        websocketUrl = "ws://localhost:" + port + "/websocket";
        basicAuthToken = "Basic " + Base64.getEncoder().encodeToString((adminUsername + ":" + adminPassword).getBytes());
        bearerAuthToken = "Bearer " + jwtBuilder.buildJwt(teamId);
    }

    public String getBasicAuthToken() {
        return basicAuthToken;
    }

    public String getBearerAuthToken() {
        return bearerAuthToken;
    }

    public Claims decodeJWT(String jwt) {
        //This line will throw an exception if it is not a signed JWS (as expected)
        return Jwts.parser()
                .setSigningKey(TextCodec.BASE64.encode(jwtSigningSecret))
                .parseClaimsJws(jwt)
                .getBody();
    }

}
