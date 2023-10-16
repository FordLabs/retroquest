package com.ford.labs.retroquest.team2;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity(name="team2")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class Team {

    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    @CreationTimestamp
    private LocalDateTime createdAt;

    public Team(String name) {
        this.name = name;
    }
}
