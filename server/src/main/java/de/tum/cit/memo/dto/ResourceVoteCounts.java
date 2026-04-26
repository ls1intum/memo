package de.tum.cit.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceVoteCounts {

    private int unrelated;
    private int weak;
    private int goodFit;
    private int perfectMatch;
}
