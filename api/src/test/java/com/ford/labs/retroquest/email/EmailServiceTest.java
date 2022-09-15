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
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.util.ReflectionTestUtils;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class EmailServiceTest {
    @Test
    void shouldTransmitCorrectValuesToMailSender() throws MessagingException, IOException {
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        MimeMessage mimeMessage = new MimeMessage((Session)null);
        when(mockSender.createMimeMessage()).thenReturn(mimeMessage);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);

        underTest.sendUnencryptedEmail("a subject", "a message", "address1@e.m", "address2@e.m");

        ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
        verify(mockSender).send(captor.capture());
        assertThat(captor.getValue().getSubject()).isEqualTo("a subject");
        assertThat(captor.getValue().getContent()).isEqualTo("a message");
        assertThat(captor.getValue().getAllRecipients()).isEqualTo(new String[]{"address1@e.m", "address2@e.m"});
    }

    @Test
    void shouldTheMessage(){
        JavaMailSender mockSender = Mockito.mock(JavaMailSender.class);
        EmailService underTest = new EmailService(mockSender);
        ReflectionTestUtils.setField(underTest, "emailEnabled", true);
        ReflectionTestUtils.setField(underTest, "appBaseUrl", "something.com");

        String actual = underTest.getPasswordResetMessage(new PasswordResetToken("t0k3n", new Team("teamUri", "teamUri", "passw0rD1"), LocalDateTime.now(), 600), new RequestPasswordResetRequest("teamUri", "e@ma.il"));

        assertThat(actual).isEqualTo(			"Hi there! \n" +
                "We’ve received a request to reset the password for the " +
                "teamUri" +
                " RetroQuest account associated with the email address " +
                "e@ma.il" +
                ". No changes have been made to your account yet. \r\n" +
                "You can reset the password by clicking the link below: \r\n" +
                "something.com" +
                "/password/reset?token=" +
                "t0k3n" +
                "\r\n" +
                "This link will expire in 10 minutes. After 10 minutes, you must submit a new password reset request at " +
                "\r\n" +
                "something.com" +
                "/request-password-reset ." +
                "\r\n" +
                "If you didn’t make this request, you can safely ignore this email. \r\n");
    }
}
