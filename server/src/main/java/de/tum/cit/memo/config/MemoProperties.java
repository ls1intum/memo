package de.tum.cit.memo.config;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "memo")
@Getter
@Setter
public class MemoProperties {

    /**
     * Allowed email domains for user access. If empty, all domains are permitted.
     * Example: mytum.de, in.tum.de, tum.de
     */
    private List<String> allowedEmailDomains = List.of();
}
