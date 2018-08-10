package com.ford.labs.retroquest.feedback;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping
    public ResponseEntity saveFeedback(@RequestBody Feedback feedback) throws URISyntaxException {
        System.out.println("saving some feedback");
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.created(new URI("/api/feedback/" + savedFeedback.getId())).build();
    }

}
