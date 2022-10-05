/*
 * Copyright (c) 2021 Ford Motor Company
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

import com.ford.labs.retroquest.team.RequestPasswordResetRequest;
import com.ford.labs.retroquest.team.Team;
import com.ford.labs.retroquest.team.password.PasswordResetToken;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mockito;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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

        String actual = underTest.getPasswordResetMessage(new PasswordResetToken("t0k3n", new Team("team-name", "Team Name", "passw0rD1"), LocalDateTime.now(), 600), new RequestPasswordResetRequest("Team Name", "e@ma.il"));

        assertThat(actual).isEqualTo(
        "Hey there! \n" +
                "You recently requested to reset your password for your RetroQuest account " +
                "Team Name" +
                " associated with your email account " +
                "e@ma.il" +
                ". No changes have been made to the account yet. \r\n" +
                "Use the link below to reset your password. This link is only valid for the next 10 minutes. \r\n" +
                "something.com/password/reset?token=t0k3n" +
                "\r\n" +
                "Thanks, \r\n" +
                "The RetroQuest Team \r\n"
        );
    }
}
