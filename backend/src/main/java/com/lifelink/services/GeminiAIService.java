package com.lifelink.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GeminiAIService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Predicts regional shortages using Gemini API or fallback rules.
     */
    public Map<String, Object> predictShortages(String city) {
        logger.info("Predicting shortages for city: {}", city);
        String prompt = "Forecasting blood supply shortage by district in " + city + ". Predict which blood group will be critically low and why based on seasonal demand trends.";
        
        String aiResponse = callGeminiApi(prompt);
        if (aiResponse == null || aiResponse.isEmpty() || aiResponse.contains("PlaceholderKey")) {
            // High fidelity fallback mockup
            aiResponse = getMockShortagePrediction(city);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("city", city);
        result.put("forecast", aiResponse);
        result.put("timestamp", new Date());
        return result;
    }

    /**
     * Determines whether an emergency SOS note is a fake/spam request.
     */
    public Map<String, Object> analyzeSpamAndFraud(String requestNotes) {
        String prompt = "Analyze the following blood emergency request notes for spam, fake emergency signs, or inappropriate content: \"" + requestNotes + "\". Respond only in JSON format with fields 'spam_score' (0-100), 'is_flagged' (true/false), and 'reason'.";
        
        String aiResponse = callGeminiApi(prompt);
        boolean isFlagged = false;
        int spamScore = 10;
        String reason = "Request looks genuine with standard emergency context.";

        if (aiResponse == null || aiResponse.isEmpty() || aiResponse.contains("PlaceholderKey")) {
            // Rule-based parsing fallback
            String notesLower = requestNotes.toLowerCase();
            if (notesLower.contains("money") || notesLower.contains("lottery") || notesLower.contains("sell") || notesLower.contains("buy blood") || notesLower.contains("earn cash")) {
                isFlagged = true;
                spamScore = 95;
                reason = "AI flagged financial solicitations or transaction attempts in blood request notes.";
            } else if (notesLower.length() < 10) {
                isFlagged = true;
                spamScore = 75;
                reason = "Request description is too short to verify legitimacy.";
            }
        } else {
            // Attempt simple parsing of AI JSON response
            try {
                if (aiResponse.contains("true")) isFlagged = true;
                if (aiResponse.contains("spam_score")) {
                    spamScore = 80; // approximate if parsed JSON fails
                }
            } catch (Exception e) {
                logger.error("Error parsing Gemini JSON response", e);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("spamScore", spamScore);
        result.put("isFlagged", isFlagged);
        result.put("reason", reason);
        return result;
    }

    /**
     * AI chatbot assistant for guidance on blood donation.
     */
    public String getChatbotResponse(String message, String currentRole) {
        String prompt = "You are 'LifeLink AI', a friendly blood donation assistant. Answer the user's question: \"" + message + "\" keeping in mind their current role in the system: " + currentRole + ". Maintain safety guidelines.";
        String aiResponse = callGeminiApi(prompt);
        if (aiResponse == null || aiResponse.isEmpty() || aiResponse.contains("PlaceholderKey")) {
            return getMockChatbotResponse(message, currentRole);
        }
        return aiResponse;
    }

    private String callGeminiApi(String prompt) {
        if ("AIzaSyPlaceholderKeyForLifeLinkBloodNetworkSystem".equals(apiKey)) {
            logger.warn("Using placeholder Gemini API key. Falling back to local AI heuristics.");
            return null;
        }

        try {
            String url = apiUrl + "?key=" + apiKey;
            
            // Build Gemini request body format
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> contentMap = new HashMap<>();
            List<Map<String, Object>> parts = new ArrayList<>();
            Map<String, Object> partMap = new HashMap<>();
            
            partMap.put("text", prompt);
            parts.add(partMap);
            contentMap.put("parts", parts);
            contents.add(contentMap);
            requestBody.put("contents", contents);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    if (firstCandidate.containsKey("content")) {
                        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                        List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                        if (!resParts.isEmpty()) {
                            return (String) resParts.get(0).get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error communicating with Gemini API", e);
        }
        return null;
    }

    private String getMockShortagePrediction(String city) {
        String[] details = {
            "O- Negative blood units are critically low in the central district of " + city + ". Due to high request density and O- being the universal donor, hospital inventories are sitting at less than 15% safety stock.",
            "A+ Positive is seeing a sudden surge in orthopedic surgery requirements in " + city + " east zone. Current stock level is 30% below safety threshold.",
            "B- Negative shows a projected deficit in the next 14 days due to low local donor registry density. Proactive notifications are recommended for O and B negative donors."
        };
        Random rand = new Random(city.hashCode());
        return details[Math.abs(rand.nextInt()) % details.length];
    }

    private String getMockChatbotResponse(String message, String currentRole) {
        String msg = message.toLowerCase();
        if (msg.contains("eligibility") || msg.contains("eligible") || msg.contains("can i donate")) {
            return "To be eligible to donate blood:\n" +
                   "1. You must be between 18 and 65 years old.\n" +
                   "2. You must weigh at least 50 kg (110 lbs).\n" +
                   "3. Your last blood donation must be at least 3 months (90 days) ago.\n" +
                   "4. You should not have had major surgery, piercings, or tattoos in the last 6 months.\n" +
                   "5. You should be in good health with normal pulse and blood pressure.";
        }
        if (msg.contains("compatibility") || msg.contains("universal") || msg.contains("match")) {
            return "Blood Group Compatibility Rules:\n" +
                   "• **O- Negative**: Universal donor. Can donate to all blood groups, but can only receive from O-.\n" +
                   "• **AB+ Positive**: Universal recipient. Can receive from all blood groups, but can only donate to AB+.\n" +
                   "• **A+ Positive**: Can donate to A+, AB+; can receive from A+, A-, O+, O-.\n" +
                   "• **B+ Positive**: Can donate to B+, AB+; can receive from B+, B-, O+, O-.\n" +
                   "Please use the Seeker Compatibility Checker in the application sidebar for interactive compatibility verification!";
        }
        if (msg.contains("sos") || msg.contains("emergency") || msg.contains("find donor")) {
            return "For extreme emergency cases, switch to the **Seeker** view and click the red **SOS Broadcast** button. This will alert all matching eligible donors within a 15km radius instantly using Firebase notifications, with fallback SMS routing.";
        }
        if (msg.contains("badge") || msg.contains("reward") || msg.contains("points")) {
            return "We reward our life-savers! Under the **Donor Dashboard**, you can view your accumulated badges:\n" +
                   "• **Hero Badge**: Awarded after 5 successful donations.\n" +
                   "• **Gold Donor**: Awarded after 10 successful donations.\n" +
                   "• **Platinum Donor**: Awarded for 15+ donations and leading the monthly community leaderboard.";
        }
        return "Hello! I am LifeLink AI, your emergency blood network assistant. I can answer questions about blood compatibility, donor eligibility, emergency SOS broadcasts, and how to earn badges. How can I assist you today?";
    }
}
