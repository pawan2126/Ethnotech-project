package com.lifelink.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Simple controller to map the root URL to the static index.html.
 * This ensures that navigating to http://localhost:8080/ serves the frontend UI.
 */
@Controller
public class HomeController {
    @GetMapping("/")
    public String index() {
        // Forward to the static index.html placed under src/main/resources/static
        return "forward:/index.html";
    }
}
