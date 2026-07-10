package com.lifelink.services;

import com.lifelink.models.Donor;
import com.lifelink.models.EmergencyRequest;
import com.lifelink.models.Notification;
import com.lifelink.repos.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
// import com.twilio.rest.api.v2010.account.Message; // removed due to naming conflict
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
// import com.google.firebase.messaging.Notification; // removed to avoid name clash
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.annotation.PostConstruct;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Value("${twilio.account.sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.from.number}")
    private String twilioFromNumber;

    @PostConstruct
    public void init() {
        // Initialize Twilio
        Twilio.init(twilioAccountSid, twilioAuthToken);
        // Initialize Firebase if not already initialized
        try {
            if (FirebaseApp.getApps().isEmpty()) {
                GoogleCredentials credentials = GoogleCredentials.fromStream(new java.io.FileInputStream(System.getenv("FIREBASE_SERVICE_ACCOUNT_PATH")));
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();
                FirebaseApp.initializeApp(options);
                logger.info("Firebase initialized for FCM notifications");
            }
        } catch (Exception e) {
            logger.error("Failed to initialize Firebase: {}", e.getMessage());
        }
    }

    @Autowired
    private NotificationRepository notificationRepository;

    // Send FCM notification if device token present, otherwise fallback to SMS via Twilio
    public void notifyEmergencyDonor(Donor donor, EmergencyRequest request, double score) {
        // Build notification entity
        String title = "Emergency Blood Request: " + request.getBloodGroup();
        String body = "A patient needs " + request.getUnitsRequired() + " unit(s) of " + request.getBloodGroup()
                + " near " + request.getHospitalName() + ". Match score: " + score;
        Notification notif = new Notification(donor.getUser(), title, body, "EMERGENCY");
        notificationRepository.save(notif);

        // Placeholder for FCM push (requires device token on donor, not present currently)
        // If donor has a device token, you would use FirebaseMessaging to send the message.
        // For this demo we log the action.
        logger.info("Sending emergency notification to donor {}: {}", donor.getId(), title);

        // Try to send FCM notification if device token is available
        if (donor.getDeviceToken() != null && !donor.getDeviceToken().isEmpty()) {
            try {
                Message fcmMessage = Message.builder()
                        .setToken(donor.getDeviceToken())
                        .setNotification(com.google.firebase.messaging.Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .build();
                String response = FirebaseMessaging.getInstance().send(fcmMessage);
                logger.info("FCM sent to donor {}: {}", donor.getId(), response);
            } catch (Exception e) {
                logger.error("FCM send failed for donor {}: {}", donor.getId(), e.getMessage());
                // Fallback to SMS
                sendSms(donor, body);
            }
        } else {
            // No device token, fallback to SMS
            sendSms(donor, body);
        }
    }

    private void sendSms(Donor donor, String body) {
        try {
            com.twilio.rest.api.v2010.account.Message.creator(
                    new PhoneNumber(donor.getUser().getPhone()),
                    new PhoneNumber(twilioFromNumber),
                    body
            ).create();
            logger.info("SMS sent to donor {} via Twilio", donor.getId());
        } catch (Exception e) {
            logger.error("Failed to send SMS via Twilio for donor {}: {}", donor.getId(), e.getMessage());
        }
    }
}
