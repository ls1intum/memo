package de.tum.cit.memo.security;

import de.tum.cit.memo.entity.User;
import de.tum.cit.memo.enums.UserRole;
import de.tum.cit.memo.repository.UserRepository;
import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class DbRoleJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        String subject = Objects.requireNonNullElse(jwt.getSubject(), "");
        UserRole role = userRepository.findById(subject)
            .map(User::getRole)
            .orElse(UserRole.USER);
        return new JwtAuthenticationToken(jwt,
            List.of(new SimpleGrantedAuthority("ROLE_" + role.name())));
    }
}
