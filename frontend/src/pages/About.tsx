import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">About TravelHub</h1>
            <p className="text-xl">Revolutionizing Travel with AI and Genetic Coding</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                TravelHub is pioneering the future of travel technology through our innovative 
                multi-agent genetic coding ecosystem. We believe that travel planning should be 
                intelligent, adaptive, and personalized to each traveler's unique preferences and needs.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Genetic Coding Architecture</h2>
              <p className="text-gray-700 mb-4">
                Our platform uses genetic programming principles to create software that evolves 
                and improves over time. Each component has "DNA" that defines its characteristics 
                and can evolve through:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li><strong>Inheritance:</strong> Base service templates that evolve</li>
                <li><strong>Mutation:</strong> Feature variations through iterations</li>
                <li><strong>Selection:</strong> Best practices emerge through testing</li>
                <li><strong>Crossover:</strong> Component reuse across services</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Multi-Agent System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Backend Agents</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Architecture Agent - System design</li>
                    <li>• Backend Agent - Spring Boot services</li>
                    <li>• Database Agent - Schema design</li>
                    <li>• Testing Agent - Quality assurance</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend Agents</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Frontend Agent - React development</li>
                    <li>• DevOps Agent - Infrastructure</li>
                    <li>• Integration Agent - Communication</li>
                    <li>• Evolution Agent - Optimization</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Java 17+</li>
                    <li>Spring Boot 3.x</li>
                    <li>Spring Cloud</li>
                    <li>Apache Kafka</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>React 18+</li>
                    <li>TypeScript 5+</li>
                    <li>Tailwind CSS</li>
                    <li>React Router v6</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Infrastructure</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>Kubernetes</li>
                    <li>Docker</li>
                    <li>Oracle Database</li>
                    <li>MongoDB</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-gray-700 text-sm">
                    Constantly evolving our platform through genetic algorithms and AI
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Reliability</h3>
                  <p className="text-gray-700 text-sm">
                    Multi-agent architecture ensures robust and dependable service
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Personalization</h3>
                  <p className="text-gray-700 text-sm">
                    Adaptive recommendations that learn and evolve with your preferences
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-gray-700 text-sm">
                    Enterprise-grade security with continuous evolution and improvement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;