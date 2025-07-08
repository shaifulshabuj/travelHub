import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComponentDNA } from '../../dna/component-dna.interface';
import { useEvolution, usePerformanceTracking } from '../../hooks/useGeneticEvolution';
import { fetchFlights } from '../../services/flightService';
import { SearchInput } from '../ui/SearchInput';
import { DatePicker } from '../ui/DatePicker';
import { Button } from '../ui/Button';
import { FlightCard } from '../ui/FlightCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import clsx from 'clsx';

interface FlightSearchProps {
  className?: string;
  onFlightSelect?: (flight: any) => void;
  evolutionEnabled?: boolean;
}

interface SearchCriteria {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

/**
 * Flight Search Component with Genetic Evolution
 * 
 * This component evolves based on:
 * - User interaction patterns
 * - Search performance metrics
 * - User satisfaction feedback
 * - Accessibility scores
 */
const GeneticFlightSearch: React.FC<FlightSearchProps> = ({ 
  className,
  onFlightSelect,
  evolutionEnabled = true
}) => {
  // Component DNA configuration
  const componentDNA: ComponentDNA = useMemo(() => ({
    componentId: 'flight-search',
    componentType: 'Component',
    version: '1.0.0',
    generation: 1,
    uiFramework: 'React',
    stylingApproach: 'TailwindCSS',
    responsiveStrategy: 'MobileFirst',
    stateManagement: {
      local: 'useState',
      global: 'Zustand',
      server: 'ReactQuery'
    },
    userInteraction: {
      formHandling: 'ReactHookForm',
      validation: 'Zod',
      navigation: 'ReactRouter'
    },
    optimization: {
      lazyLoading: true,
      memoization: true,
      virtualization: false,
      codesplitting: true,
      prefetching: true,
      serviceWorker: false
    },
    a11y: {
      semanticHTML: true,
      ariaLabels: true,
      keyboardNavigation: true,
      screenReaderSupport: true,
      colorContrast: true,
      focusManagement: true
    },
    i18n: {
      supported: true,
      rtlSupport: false,
      dateLocalization: true,
      numberFormatting: true,
      pluralization: true
    },
    adaptationTraits: {
      themeable: true,
      customizable: true,
      extensible: true,
      configurable: true,
      responsive: true
    },
    performance: {
      renderTime: 100,
      bundleSize: 50,
      accessibilityScore: 95,
      lighthouseScore: 90,
      coreWebVitals: {
        largestContentfulPaint: 2500,
        firstInputDelay: 100,
        cumulativeLayoutShift: 0.1
      }
    },
    userExperience: {
      usabilityScore: 85,
      satisfactionRating: 4.2,
      taskCompletionRate: 0.89,
      errorRate: 0.02,
      learnabilityScore: 80
    },
    dependencies: {
      components: ['SearchInput', 'DatePicker', 'Button', 'FlightCard'],
      hooks: ['useQuery', 'useState', 'useEffect'],
      services: ['flightService'],
      utilities: ['clsx', 'date-fns'],
      libraries: ['react-query']
    },
    parentComponents: [],
    evolutionPath: [],
    fitnessHistory: [],
    testing: {
      unitTestCoverage: 85,
      integrationTests: true,
      e2eTests: true,
      visualRegressionTests: true,
      accessibilityTests: true
    }
  }), []);

  // Genetic evolution hooks
  const { evolve, fitness, generation, isEvolving } = useEvolution(
    componentDNA.componentId, 
    componentDNA
  );
  
  const { recordRenderTime, recordInteraction, getMetrics } = usePerformanceTracking(
    componentDNA.componentId
  );

  // Component state with genetic adaptation
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [userPreferences, setUserPreferences] = useState<any>({});

  // Evolution-aware data fetching
  const { 
    data: flights, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['flights', searchCriteria],
    queryFn: () => fetchFlights(searchCriteria),
    enabled: !!searchCriteria.from && !!searchCriteria.to && !!searchCriteria.departDate,
    // Genetic optimization traits
    staleTime: componentDNA.optimization.memoization ? 300000 : 0,
    gcTime: componentDNA.optimization.memoization ? 600000 : 0,
    retry: componentDNA.optimization.prefetching ? 3 : 1
  });

  // Performance tracking
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      recordRenderTime(renderTime);
      
      // Trigger evolution if performance degrades
      if (renderTime > componentDNA.performance.renderTime * 1.5) {
        evolve('performance_degradation');
      }
    };
  });

  // Genetic search handler with evolution tracking
  const handleSearch = useCallback(async () => {
    const startTime = performance.now();
    
    recordInteraction('search_initiated');
    
    try {
      await refetch();
      
      const searchTime = performance.now() - startTime;
      recordRenderTime(searchTime);
      
      // Evolution triggers based on performance
      if (searchTime > 3000) {
        await evolve('slow_search_performance');
      }
      
      recordInteraction('search_completed');
    } catch (error) {
      recordInteraction('search_error');
      await evolve('error_rate_increase');
    }
  }, [searchCriteria, refetch, recordInteraction, recordRenderTime, evolve]);

  // Genetic form handling with adaptive validation
  const handleInputChange = useCallback((field: keyof SearchCriteria, value: any) => {
    setSearchCriteria(prev => ({ ...prev, [field]: value }));
    recordInteraction(`${field}_changed`);
    
    // Learn user preferences for evolution
    if (field === 'class' || field === 'passengers') {
      setUserPreferences(prev => ({ ...prev, [field]: value }));
    }
  }, [recordInteraction]);

  // Flight selection with feedback collection
  const handleFlightSelect = useCallback((flight: any) => {
    recordInteraction('flight_selected');
    onFlightSelect?.(flight);
    
    // Collect user satisfaction data for evolution
    setTimeout(() => {
      // This would typically show a satisfaction survey
      evolve('user_interaction_pattern');
    }, 5000);
  }, [onFlightSelect, recordInteraction, evolve]);

  // Responsive layout based on genetic traits
  const containerClassName = useMemo(() => {
    const baseClasses = 'flight-search-container';
    
    const responsiveClasses = componentDNA.responsiveStrategy === 'MobileFirst' 
      ? 'flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4'
      : 'flex flex-row space-x-4 mobile:flex-col mobile:space-x-0 mobile:space-y-4';
    
    return clsx(
      baseClasses,
      responsiveClasses,
      className,
      {
        'opacity-75 pointer-events-none': isEvolving,
        'ring-2 ring-blue-500': evolutionEnabled && fitness > 0.9
      }
    );
  }, [componentDNA.responsiveStrategy, className, isEvolving, evolutionEnabled, fitness]);

  // Accessibility props based on genetic configuration
  const accessibilityProps = useMemo(() => {
    if (!componentDNA.a11y.semanticHTML) return {};
    
    return {
      role: 'search',
      'aria-label': 'Flight search form',
      'aria-live': 'polite',
      'aria-busy': isLoading || isEvolving
    };
  }, [componentDNA.a11y.semanticHTML, isLoading, isEvolving]);

  // Lazy loading implementation
  const LazyDatePicker = useMemo(() => {
    if (!componentDNA.optimization.lazyLoading) return DatePicker;
    
    return React.lazy(() => import('../ui/DatePicker'));
  }, [componentDNA.optimization.lazyLoading]);

  // Render evolution indicator
  const renderEvolutionIndicator = () => {
    if (!evolutionEnabled) return null;
    
    return (
      <div className="evolution-indicator text-xs text-gray-500 mb-2">
        Generation: {generation} | Fitness: {(fitness * 100).toFixed(1)}%
        {isEvolving && <span className="ml-2 animate-pulse">🧬 Evolving...</span>}
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={<div>Search component encountered an error</div>}>
      <div className={containerClassName} {...accessibilityProps}>
        {renderEvolutionIndicator()}
        
        <div className="search-form flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Origin input with genetic adaptation */}
            <SearchInput
              label="From"
              value={searchCriteria.from}
              onChange={(value) => handleInputChange('from', value)}
              placeholder="Departure city"
              required
              aria-describedby="from-help"
            />
            
            {/* Destination input */}
            <SearchInput
              label="To"
              value={searchCriteria.to}
              onChange={(value) => handleInputChange('to', value)}
              placeholder="Destination city"
              required
              aria-describedby="to-help"
            />
            
            {/* Departure date with lazy loading */}
            {componentDNA.optimization.lazyLoading ? (
              <React.Suspense fallback={<div className="h-12 bg-gray-200 animate-pulse rounded" />}>
                <LazyDatePicker
                  label="Departure"
                  value={searchCriteria.departDate}
                  onChange={(value) => handleInputChange('departDate', value)}
                  required
                />
              </React.Suspense>
            ) : (
              <DatePicker
                label="Departure"
                value={searchCriteria.departDate}
                onChange={(value) => handleInputChange('departDate', value)}
                required
              />
            )}
            
            {/* Return date - conditional based on user preference evolution */}
            {(isAdvancedSearch || userPreferences.showReturnDate) && (
              <DatePicker
                label="Return"
                value={searchCriteria.returnDate || ''}
                onChange={(value) => handleInputChange('returnDate', value)}
                optional
              />
            )}
          </div>
          
          {/* Advanced options - evolves based on user usage patterns */}
          {isAdvancedSearch && (
            <div className="advanced-options mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <SearchInput
                label="Passengers"
                type="number"
                value={searchCriteria.passengers.toString()}
                onChange={(value) => handleInputChange('passengers', parseInt(value) || 1)}
                min="1"
                max="9"
              />
              
              <select
                className="form-select"
                value={searchCriteria.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
                aria-label="Travel class"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="actions mt-6 flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSearch}
              disabled={!searchCriteria.from || !searchCriteria.to || !searchCriteria.departDate || isLoading}
              className="primary flex-1"
              loading={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Flights'}
            </Button>
            
            <Button
              onClick={() => setIsAdvancedSearch(!isAdvancedSearch)}
              variant="outline"
              className="sm:w-auto"
            >
              {isAdvancedSearch ? 'Basic Search' : 'Advanced Options'}
            </Button>
          </div>
        </div>
        
        {/* Results section with genetic optimization */}
        <div className="search-results mt-8">
          {error && (
            <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              Search failed. Please try again.
            </div>
          )}
          
          {isLoading && (
            <div className="loading-state flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          )}
          
          {flights && flights.length > 0 && (
            <div className="flights-grid">
              <h2 className="text-xl font-semibold mb-4">
                Found {flights.length} flights
              </h2>
              
              {/* Virtualization for large result sets */}
              {componentDNA.optimization.virtualization && flights.length > 50 ? (
                <div className="virtual-list">     Virtual List Implementation </div>
              ) : (
                <div className="space-y-4">
                  {flights.map((flight, index) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      onSelect={() => handleFlightSelect(flight)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {flights && flights.length === 0 && (
            <div className="no-results text-center py-8 text-gray-500">
              No flights found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Memoization for performance - genetic trait
export default React.memo(GeneticFlightSearch);

// Component metadata for evolution tracking
GeneticFlightSearch.displayName = 'GeneticFlightSearch';
GeneticFlightSearch.componentDNA = {
  id: 'flight-search',
  version: '1.0.0',
  generation: 1,
  traits: ['responsive', 'accessible', 'performant', 'evolvable']
};