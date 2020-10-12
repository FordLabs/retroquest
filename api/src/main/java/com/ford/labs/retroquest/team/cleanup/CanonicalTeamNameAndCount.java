package com.ford.labs.retroquest.team.cleanup;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CanonicalTeamNameAndCount {
    private String name;
    private Long count;
}
