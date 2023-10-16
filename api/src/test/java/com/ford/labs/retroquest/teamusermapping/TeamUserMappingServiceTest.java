package com.ford.labs.retroquest.teamusermapping;

import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class TeamUserMappingServiceTest {

    private final TeamUserMappingRepository mockRepository = mock(TeamUserMappingRepository.class);
    private final TeamUserMappingService service = new TeamUserMappingService(mockRepository);

    @Test
    void addUserToTeam_SavesRecordToRepositoryWithTeamAndUserId() {
        var teamId = UUID.randomUUID();
        var userId = "User ID";
        service.addUserToTeam(teamId, userId);
        verify(mockRepository).save(new TeamUserMapping(null, teamId, userId, null));
    }

}