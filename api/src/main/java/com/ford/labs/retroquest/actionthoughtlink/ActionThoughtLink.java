package com.ford.labs.retroquest.actionthoughtlink;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ActionThoughtLink {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "thought_id")
    private Long thoughtId;

    @Column(name = "action_item_id")
    private Long actionItemId;
}
