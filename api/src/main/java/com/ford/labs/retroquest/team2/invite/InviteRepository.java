package com.ford.labs.retroquest.team2.invite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface InviteRepository extends JpaRepository<Invite, UUID> {
}
