package com.ford.labs.retroquest.team2.invite;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/team2/{id}/invites")
public class InviteController {

    @PostMapping
    public ResponseEntity createInvite(@PathVariable("id") UUID teamId) {
        throw new UnsupportedOperationException();
    }
}
