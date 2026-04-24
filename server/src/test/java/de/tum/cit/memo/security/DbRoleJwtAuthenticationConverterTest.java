package de.tum.cit.memo.security;

import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DbRoleJwtAuthenticationConverterTest {

    @Mock
    private UserRepository userRepository;

    private DbRoleJwtAuthenticationConverter converter;

    @BeforeEach
    void setUp() {
        converter = new DbRoleJwtAuthenticationConverter(userRepository);
    }

    private Jwt jwtWithSubject(String subject) {
        return Jwt.withTokenValue("token")
            .header("alg", "none")
            .subject(subject)
            .build();
    }

    @Nested
    @DisplayName("convert")
    class Convert {

        @Test
        @DisplayName("should grant ROLE_ADMIN for a user with ADMIN role in the database")
        void shouldGrantAdminRoleForAdminUser() {
            User admin = User.builder().id("admin-id").role(UserRole.ADMIN).build();
            when(userRepository.findById("admin-id")).thenReturn(Optional.of(admin));

            AbstractAuthenticationToken token = converter.convert(jwtWithSubject("admin-id"));

            assertThat(token.getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        @Test
        @DisplayName("should grant ROLE_USER for a user with USER role in the database")
        void shouldGrantUserRoleForRegularUser() {
            User user = User.builder().id("user-id").role(UserRole.USER).build();
            when(userRepository.findById("user-id")).thenReturn(Optional.of(user));

            AbstractAuthenticationToken token = converter.convert(jwtWithSubject("user-id"));

            assertThat(token.getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER"))
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        @Test
        @DisplayName("should default to ROLE_USER for an unknown subject not in the database")
        void shouldDefaultToUserRoleForUnknownSubject() {
            when(userRepository.findById("unknown")).thenReturn(Optional.empty());

            AbstractAuthenticationToken token = converter.convert(jwtWithSubject("unknown"));

            assertThat(token.getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_USER"))
                .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }

        @Test
        @DisplayName("should preserve the original JWT in the returned token")
        void shouldPreserveJwtInToken() {
            when(userRepository.findById("any")).thenReturn(Optional.empty());
            Jwt jwt = jwtWithSubject("any");

            AbstractAuthenticationToken token = converter.convert(jwt);

            assertThat(token.getCredentials()).isEqualTo(jwt);
        }
    }
}
