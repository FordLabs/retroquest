package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.team.validation.PasswordConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdatePasswordRequest {

    private String teamUri;

    private String previousPassword;

    @PasswordConstraint
    private String newPassword;
}
