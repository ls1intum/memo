package de.tum.cit.memo.controller;

import de.tum.cit.memo.config.MemoProperties;
import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Authentication and user sync")
@SecurityRequirement(name = "bearer-jwt")
public class AuthController {

    private final UserService userService;

    private final MemoProperties memoProperties;

    @GetMapping("/me")
    @Operation(summary = "Get or create current authenticated user")
    public ResponseEntity<Map<String, String>> me(@AuthenticationPrincipal Jwt jwt) {
        List<String> allowedDomains = memoProperties.getAllowedEmailDomains();
        if (!allowedDomains.isEmpty()) {
            String email = jwt.getClaimAsString("email");
            if (email == null || !isAllowedDomain(email, allowedDomains)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Email domain not permitted. Please use a university email address."));
            }
        }
        String sub = jwt.getSubject();
        User user = userService.findOrCreateBySubject(sub);
        return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "role", user.getRole().name()
        ));
    }

    private static boolean isAllowedDomain(String email, List<String> allowedDomains) {
        int atIndex = email.indexOf('@');
        if (atIndex < 0) {
            return false;
        }
        String domain = email.substring(atIndex + 1).toLowerCase(java.util.Locale.ROOT);
        return allowedDomains.contains(domain);
    }
}
