package de.tum.cit.memo.controller;

import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and user sync")
@SecurityRequirement(name = "bearer-jwt")
public class AuthController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Get or create current authenticated user")
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal Jwt jwt) {
        String sub = jwt.getSubject();
        User user = userService.findOrCreateBySubject(sub);
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "role", user.getRole().name()
        ));
    }
}
