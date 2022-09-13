package com.ford.labs.retroquest.team.password;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ford.labs.retroquest.team.Team;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import javax.persistence.*;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class PasswordResetToken {

    @Id
    @JsonIgnore
    @Builder.Default
    private String resetToken = UUID.randomUUID().toString();

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="team_id", referencedColumnName="uri")
    private Team team;

    @JsonIgnore
    @Builder.Default
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Transient
    @Builder.Default
    private int maximumAge = 600;

    public boolean isExpired(){
        return Math.abs(Duration.between(LocalDateTime.now(), dateCreated).toSeconds()) > maximumAge;
    }
}
