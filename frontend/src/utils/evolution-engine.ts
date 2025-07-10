// Local copy of EvolutionEngine for testing purposes
import { ComponentDNA } from '../dna/component-dna.interface';

export interface ServiceDNA {
  serviceId: string;
  generation: number;
  parentServices: string[];
  evolutionTriggers: string[];
}

export interface EvolutionContext {
  trigger: string;
  metrics: Record<string, number>;
}

export interface EvolutionConfig {
  selectionRate: number;
  eliteRate: number;
  crossoverRate: number;
  mutationRate: number;
  crossoverTraits: string[];
  mutationTriggers: string[];
  maxGenerations: number;
  fitnessThreshold: number;
}

export interface FitnessEvaluator {
  evaluate<T extends ServiceDNA | ComponentDNA>(individual: T): Promise<number>;
}

export interface GeneticOperator {
  applyTrait<T extends ServiceDNA | ComponentDNA>(
    dna: T, 
    trait: string, 
    context: EvolutionContext
  ): Promise<T>;
  
  mutate<T extends ServiceDNA | ComponentDNA>(
    dna: T, 
    trigger: string
  ): Promise<T>;
  
  inheritTrait<T extends ServiceDNA | ComponentDNA>(
    offspring: T, 
    parent: T, 
    trait: string
  ): Promise<T>;
}

export interface SelectionStrategy {
  select<T extends ServiceDNA | ComponentDNA>(population: T[]): T;
}

export class EvolutionEngine {
  private fitnessEvaluator: FitnessEvaluator;
  private geneticOperator: GeneticOperator;
  private selectionStrategy: SelectionStrategy;
  
  constructor(
    fitnessEvaluator: FitnessEvaluator,
    geneticOperator: GeneticOperator,
    selectionStrategy: SelectionStrategy
  ) {
    this.fitnessEvaluator = fitnessEvaluator;
    this.geneticOperator = geneticOperator;
    this.selectionStrategy = selectionStrategy;
  }
  
  async inherit<T extends ServiceDNA | ComponentDNA>(
    parentDNA: T, 
    traits: string[],
    evolutionContext: EvolutionContext
  ): Promise<T> {
    let inheritedDNA = { ...parentDNA } as T;
    
    inheritedDNA.generation = parentDNA.generation + 1;
    
    if ('parentServices' in inheritedDNA) {
      (inheritedDNA as ServiceDNA).parentServices = [
        ...(parentDNA as ServiceDNA).parentServices,
        (parentDNA as ServiceDNA).serviceId
      ];
    } else {
      (inheritedDNA as ComponentDNA).parentComponents = [
        ...(parentDNA as ComponentDNA).parentComponents,
        (parentDNA as ComponentDNA).componentId
      ];
    }
    
    for (const trait of traits) {
      inheritedDNA = await this.applyTrait(inheritedDNA, trait, evolutionContext);
    }
    
    return inheritedDNA;
  }
  
  async mutate<T extends ServiceDNA | ComponentDNA>(
    dna: T, 
    mutationTriggers: string[],
    mutationRate: number = 0.1
  ): Promise<T> {
    let mutatedDNA = { ...dna } as T;
    
    for (const trigger of mutationTriggers) {
      if (Math.random() < mutationRate) {
        mutatedDNA = await this.applyMutation(mutatedDNA, trigger);
      }
    }
    
    if ('evolutionTriggers' in mutatedDNA) {
      mutatedDNA.evolutionTriggers.push(...mutationTriggers);
    }
    
    return mutatedDNA;
  }
  
  async crossover<T extends ServiceDNA | ComponentDNA>(
    parent1: T, 
    parent2: T, 
    traits: string[],
    crossoverRate: number = 0.7
  ): Promise<T> {
    if (Math.random() > crossoverRate) {
      return parent1;
    }
    
    let offspring = { ...parent1 } as T;
    
    for (const trait of traits) {
      if (Math.random() < 0.5) {
        offspring = await this.inheritTraitFromParent(offspring, parent2, trait);
      }
    }
    
    offspring.generation = Math.max(parent1.generation, parent2.generation) + 1;
    
    return offspring;
  }
  
  async selectFittest<T extends ServiceDNA | ComponentDNA>(
    population: T[], 
    selectionRate: number = 0.7
  ): Promise<T[]> {
    const fitnessScores = await Promise.all(
      population.map(individual => this.calculateFitness(individual))
    );
    
    const populationWithFitness = population.map((individual, index) => ({
      individual,
      fitness: fitnessScores[index]
    }));
    
    populationWithFitness.sort((a, b) => b.fitness - a.fitness);
    
    const selectedCount = Math.ceil(population.length * selectionRate);
    return populationWithFitness
      .slice(0, selectedCount)
      .map(item => item.individual);
  }
  
  async evolvePopulation<T extends ServiceDNA | ComponentDNA>(
    population: T[],
    evolutionConfig: EvolutionConfig
  ): Promise<T[]> {
    const selected = await this.selectFittest(population, evolutionConfig.selectionRate);
    
    const eliteCount = Math.ceil(population.length * evolutionConfig.eliteRate);
    const elite = selected.slice(0, eliteCount);
    
    const offspring: T[] = [];
    
    while (offspring.length < population.length - elite.length) {
      const parent1 = this.selectParent(selected);
      const parent2 = this.selectParent(selected);
      
      let child = await this.crossover(
        parent1, 
        parent2, 
        evolutionConfig.crossoverTraits,
        evolutionConfig.crossoverRate
      );
      
      child = await this.mutate(
        child,
        evolutionConfig.mutationTriggers,
        evolutionConfig.mutationRate
      );
      
      offspring.push(child);
    }
    
    return [...elite, ...offspring];
  }
  
  private async calculateFitness<T extends ServiceDNA | ComponentDNA>(
    individual: T
  ): Promise<number> {
    return this.fitnessEvaluator.evaluate(individual);
  }
  
  private async applyTrait<T extends ServiceDNA | ComponentDNA>(
    dna: T,
    trait: string,
    context: EvolutionContext
  ): Promise<T> {
    return this.geneticOperator.applyTrait(dna, trait, context);
  }
  
  private async applyMutation<T extends ServiceDNA | ComponentDNA>(
    dna: T,
    trigger: string
  ): Promise<T> {
    return this.geneticOperator.mutate(dna, trigger);
  }
  
  private async inheritTraitFromParent<T extends ServiceDNA | ComponentDNA>(
    offspring: T,
    parent: T,
    trait: string
  ): Promise<T> {
    return this.geneticOperator.inheritTrait(offspring, parent, trait);
  }
  
  private selectParent<T extends ServiceDNA | ComponentDNA>(population: T[]): T {
    return this.selectionStrategy.select(population);
  }
}