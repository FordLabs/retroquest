package com.ford.labs.retroquest.users;

import com.ford.labs.retroquest.board.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserTeamMappingRepository extends JpaRepository<UserTeamMapping, Long> {
    List<UserTeamMapping> findAllByTeamUri(String teamUri);
    List<UserTeamMapping> findAllByTeamUriAndUserId(String teamUri, Long userId);

}
