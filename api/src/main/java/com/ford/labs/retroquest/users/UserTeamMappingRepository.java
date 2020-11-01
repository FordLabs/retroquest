package com.ford.labs.retroquest.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTeamMappingRepository extends JpaRepository<UserTeamMapping, Long> {
    List<UserTeamMapping> findAllByTeamUri(String teamUri);
    List<UserTeamMapping> findAllByTeamUriAndUserId(String teamUri, Long userId);

}
