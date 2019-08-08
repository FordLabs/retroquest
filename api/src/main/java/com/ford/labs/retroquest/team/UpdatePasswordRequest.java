package com.ford.labs.retroquest.team;

import com.ford.labs.retroquest.validation.PasswordConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdatePasswordRequest {

    private String teamId;

    private String previousPassword;

    @PasswordConstraint
    private String newPassword;
}
