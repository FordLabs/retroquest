package com.ford.labs.retroquest.teamusermapping;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class TeamUserMapping {
    @Id
    @GeneratedValue
    private UUID id;
    private UUID teamId;
    private String userId;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
