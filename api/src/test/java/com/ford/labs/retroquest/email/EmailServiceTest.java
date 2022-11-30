/*
 * Copyright (c) 2022 Ford Motor Company
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ford.labs.retroquest.email;

import com.ford.labs.retroquest.email_reset_token.EmailResetToken;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.password_reset_token.PasswordResetToken;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class EmailServiceTest {
    @Test
    void shouldTransmitCorrectValuesToMailSender() {
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);

        underTest.sendUnencryptedEmail("a subject", "a message", "address1@e.m", "address2@e.m");

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mockSender).send(captor.capture());
        assertThat(captor.getValue().getSubject()).isEqualTo("a subject");
        assertThat(captor.getValue().getText()).isEqualTo("a message");
        assertThat(captor.getValue().getTo()).isEqualTo(new String[]{"address1@e.m", "address2@e.m"});
    }

    @Test
    void shouldGetThePasswordResetMessage(){
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);
        ReflectionTestUtils.setField(underTest, "appBaseUrl", "something.com");

        String actualMessage = underTest.getPasswordResetEmailMessage(new PasswordResetToken("t0k3n", new Team("team-name", "Team Name", "passw0rD1"), LocalDateTime.now(), 600), new ResetRequest("Team Name", "e@ma.il"));

        assertThat(actualMessage).isEqualTo(
        """
                Hey there!\s

                You recently requested to reset your password for your RetroQuest account "Team Name" associated with your email account e@ma.il. No changes have been made to the account yet. \r

                Use the link below to reset your password. This link is only valid for the next 10 minutes. \r

                something.com/password/reset?token=t0k3n\r

                Thanks, \r
                The RetroQuest Team \r
                """
        );
    }

    @Test
    public void shouldGetTeamNameRecoveryEmailMessage() {
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);
        ReflectionTestUtils.setField(underTest, "appBaseUrl", "something.com");

        List<String> teamNamesAssociatedWithEmail = Arrays.asList("Team 4", "Team 10", "Team 3", "Team 1");
        String actualMessage = underTest.getTeamNameRecoveryEmailMessage(
                "recovery@mail.com",
                teamNamesAssociatedWithEmail
        );

        assertThat(actualMessage).isEqualTo(
        """
                Hey there!\s
                We've received a request to send you the RetroQuest name(s) associated with your email (recovery@mail.com).\r
    
                Team 4\r
                Team 10\r
                Team 3\r
                Team 1\r
    
                Thanks, \r
                The RetroQuest Team \r
                """
        );
    }

    @Test
    void shouldGetTheEmailResetMessage() {
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);
        ReflectionTestUtils.setField(underTest, "appBaseUrl", "something.com");

        String actualMessage = underTest.getResetTeamEmailMessage(new EmailResetToken("t0k3n", new Team("team-name", "Team Name", "passw0rD1"), LocalDateTime.now(), 600), new ResetRequest("Team Name", "e@ma.il"));

        assertThat(actualMessage).isEqualTo(
        """
                Hey there!\s
        
                Someone from your RetroQuest team, "Team Name" recently requested to reset the board owner emails. No changes have been made to the account yet. \r
        
                Use the link below to reset your team emails. This link is only valid for the next 10 minutes. \r
        
                something.com/email/reset?token=t0k3n\r
        
                Thanks, \r
                The RetroQuest Team \r
                """
        );
    }
}