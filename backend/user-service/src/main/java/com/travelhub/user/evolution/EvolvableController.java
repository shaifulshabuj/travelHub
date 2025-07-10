package com.travelhub.user.evolution;

import java.util.Map;

/**
 * Interface for evolvable controllers
 */
public interface EvolvableController {
    
    /**
     * Evolve the controller based on a trigger and context
     * @param trigger The evolution trigger
     * @param context Additional context for evolution
     */
    void evolve(String trigger, Map<String, Object> context);
}
