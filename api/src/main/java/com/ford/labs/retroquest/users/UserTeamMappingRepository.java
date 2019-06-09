package com.ford.labs.retroquest.users;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTeamMappingRepository extends JpaRepository<UserTeamMapping, Long> {
}
