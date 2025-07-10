package com.travelhub.user.evolution;

import java.util.Map;

/**
 * Interface for evolvable controllers
 */
public interface EvolvableController {
    /**
     * Evolution method - called when genetic adaptation is triggered
     */
    void evolve(String trigger, Map<String, Object> context);
}
