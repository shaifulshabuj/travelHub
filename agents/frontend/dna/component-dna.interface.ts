// Component DNA Interface - Genetic blueprint for React components
export interface ComponentDNA {
  // Core genetics
  componentId: string;
  componentType: 'Page' | 'Component' | 'Hook' | 'Service' | 'Layout' | 'Provider';
  version: string;
  generation: number;
  
  // UI genetics
  uiFramework: 'React' | 'Vue' | 'Angular';
  stylingApproach: 'TailwindCSS' | 'StyledComponents' | 'CSSModules' | 'Emotion';
  responsiveStrategy: 'MobileFirst' | 'DesktopFirst' | 'Adaptive';
  
  // State genetics
  stateManagement: {
    local: 'useState' | 'useReducer' | 'custom';
    global: 'Context' | 'Zustand' | 'Redux' | 'Jotai' | 'Valtio';
    server: 'ReactQuery' | 'SWR' | 'Apollo' | 'Relay' | 'custom';
  };
  
  // Interaction genetics
  userInteraction: {
    formHandling: 'ReactHookForm' | 'Formik' | 'Custom';
    validation: 'Zod' | 'Yup' | 'JoiSchema' | 'Custom';
    navigation: 'ReactRouter' | 'NextRouter' | 'ReachRouter' | 'Custom';
  };
  
  // Performance genetics
  optimization: {
    lazyLoading: boolean;
    memoization: boolean;
    virtualization: boolean;
    codesplitting: boolean;
    prefetching: boolean;
    serviceWorker: boolean;
  };
  
  // Accessibility genetics
  a11y: {
    semanticHTML: boolean;
    ariaLabels: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    colorContrast: boolean;
    focusManagement: boolean;
  };
  
  // Internationalization genetics
  i18n: {
    supported: boolean;
    rtlSupport: boolean;
    dateLocalization: boolean;
    numberFormatting: boolean;
    pluralization: boolean;
  };
  
  // Evolution capabilities
  adaptationTraits: {
    themeable: boolean;
    customizable: boolean;
    extensible: boolean;
    configurable: boolean;
    responsive: boolean;
  };
  
  // Fitness criteria
  performance: {
    renderTime: number;        // milliseconds
    bundleSize: number;        // KB
    accessibilityScore: number; // 0-100
    lighthouseScore: number;   // 0-100
    coreWebVitals: CoreWebVitals;
  };
  
  // User experience metrics
  userExperience: {
    usabilityScore: number;
    satisfactionRating: number;
    taskCompletionRate: number;
    errorRate: number;
    learnabilityScore: number;
  };
  
  // Dependencies
  dependencies: {
    components: string[];
    hooks: string[];
    services: string[];
    utilities: string[];
    libraries: string[];
  };
  
  // Evolution history
  parentComponents: string[];
  evolutionPath: EvolutionStep[];
  fitnessHistory: ComponentFitnessRecord[];
  
  // Testing genetics
  testing: {
    unitTestCoverage: number;
    integrationTests: boolean;
    e2eTests: boolean;
    visualRegressionTests: boolean;
    accessibilityTests: boolean;
  };
}

export interface CoreWebVitals {
  largestContentfulPaint: number; // milliseconds
  firstInputDelay: number;        // milliseconds
  cumulativeLayoutShift: number;  // score
}

export interface EvolutionStep {
  generation: number;
  timestamp: Date;
  evolutionType: 'Inheritance' | 'Mutation' | 'Crossover' | 'Selection';
  trigger: string;
  changes: ComponentChange[];
  fitnessImprovement: number;
}

export interface ComponentChange {
  property: string;
  oldValue: any;
  newValue: any;
  reason: string;
}

export interface ComponentFitnessRecord {
  timestamp: Date;
  generation: number;
  performanceScore: number;
  accessibilityScore: number;
  usabilityScore: number;
  maintainabilityScore: number;
  overallFitness: number;
  userFeedback?: ComponentUserFeedback;
}

export interface ComponentUserFeedback {
  interactionRating: number;
  visualAppealRating: number;
  usabilityRating: number;
  performanceRating: number;
  suggestions: string[];
}