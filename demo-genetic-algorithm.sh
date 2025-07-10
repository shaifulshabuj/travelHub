#!/bin/bash

echo "=== TravelHub Genetic Algorithm Demonstration ==="
echo ""
echo "🧬 Building the genetic algorithm system..."
cd /home/runner/work/travelHub/travelHub/backend

# Build the project
./gradlew build -x test --no-daemon --quiet

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    echo "🧪 Running genetic algorithm tests..."
    ./gradlew test --no-daemon --tests "*GeneticAlgorithmTest*" --tests "*GeneticEvolutionIntegrationTest*" --quiet
    
    if [ $? -eq 0 ]; then
        echo "✅ All genetic algorithm tests passed!"
        echo ""
        
        echo "📊 Running integration tests with evolution output..."
        ./gradlew test --no-daemon --tests "*GeneticEvolutionIntegrationTest*" 2>&1 | grep -A 25 "==="
        
        echo ""
        echo "🎉 Genetic Algorithm is working correctly!"
        echo ""
        echo "Key features verified:"
        echo "  ✓ Fitness tracking and calculation"
        echo "  ✓ Evolution triggers based on operation count"
        echo "  ✓ Genetic optimization methods"
        echo "  ✓ User generation advancement"
        echo "  ✓ DNA fitness calculation"
        echo "  ✓ Operation counting and metrics"
        echo ""
        echo "The genetic algorithm can now:"
        echo "  • Track user fitness scores"
        echo "  • Trigger evolution based on performance metrics"
        echo "  • Apply genetic optimizations (batch processing, JWT features)"
        echo "  • Calculate DNA fitness for service improvement"
        echo "  • Record and analyze evolution patterns"
        
    else
        echo "❌ Some tests failed. Check the test output above."
    fi
else
    echo "❌ Build failed. Check the build output above."
fi

echo ""
echo "=== Demonstration Complete ==="