package com.ford.labs.retroquest.team2;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Team2 {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private LocalDateTime createdAt;

    public Team2(String name) {
        this.name = name;
        this.createdAt = LocalDateTime.now();
    }
}
