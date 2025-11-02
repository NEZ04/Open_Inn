// Test script to verify the AI matchmaking integration
// Run this with: node test-matchmaking.js

const testData = {
  project_requirements: {
    project_id: "proj123",
    project_name: "E-commerce Platform",
    required_skills: ["react", "node.js", "mongodb"],
    experience_level: "intermediate",
    required_hours: 20,
    domain: "web development",
    description: "Building a modern e-commerce platform"
  },
  candidates: [
    {
      user_id: "user1",
      name: "Alice Johnson",
      email: "alice@example.com",
      skills: ["react", "javascript", "css"],
      experience_level: "junior",
      available_hours: 15,
      interests: ["web development", "UI/UX"],
      bio: "Frontend developer with passion for design"
    },
    {
      user_id: "user2",
      name: "Bob Smith",
      email: "bob@example.com",
      skills: ["react", "node.js", "mongodb", "typescript"],
      experience_level: "senior",
      available_hours: 30,
      interests: ["web development", "cloud computing"],
      bio: "Full-stack developer with 5 years experience"
    },
    {
      user_id: "user3",
      name: "Charlie Brown",
      email: "charlie@example.com",
      skills: ["python", "django", "postgresql"],
      experience_level: "intermediate",
      available_hours: 20,
      interests: ["backend development", "data science"],
      bio: "Backend specialist"
    },
    {
      user_id: "user4",
      name: "Diana Prince",
      email: "diana@example.com",
      skills: ["react", "node.js", "graphql"],
      experience_level: "intermediate",
      available_hours: 25,
      interests: ["web development", "API design"],
      bio: "Full-stack developer focusing on modern tech"
    }
  ],
  top_n: 10
};

async function testMatchmaking() {
  console.log('🧪 Testing AI Matchmaking Service\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Direct call to Python microservice
    console.log('\n📍 Test 1: Direct Python Microservice Call');
    console.log('URL: http://localhost:8001/api/matchmaking/match');
    
    const directResponse = await fetch('http://localhost:8001/api/matchmaking/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!directResponse.ok) {
      throw new Error(`Direct call failed: ${directResponse.statusText}`);
    }
    
    const directResult = await directResponse.json();
    console.log('✅ Direct microservice call successful!');
    console.log(`   Found ${directResult.matches.length} matches for "${directResult.project_name}"`);
    console.log('\n   Top 3 Matches:');
    directResult.matches.slice(0, 3).forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.name} - Score: ${match.match_score}%`);
      console.log(`      Skills: ${match.skills.join(', ')}`);
      console.log(`      Experience: ${match.experience_level}`);
    });
    
    // Test 2: Call through Node.js backend
    console.log('\n\n📍 Test 2: Through Node.js Backend');
    console.log('URL: http://localhost:8000/api/matchmaking/recommendations');
    
    const backendResponse = await fetch('http://localhost:8000/api/matchmaking/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      throw new Error(`Backend call failed: ${backendResponse.statusText}\n${errorText}`);
    }
    
    const backendResult = await backendResponse.json();
    console.log('✅ Backend integration successful!');
    
    if (backendResult.success) {
      console.log(`   Found ${backendResult.data.matches.length} matches`);
      console.log('\n   Top 3 Matches:');
      backendResult.data.matches.slice(0, 3).forEach((match, index) => {
        console.log(`   ${index + 1}. ${match.name} - Score: ${match.match_score}%`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All tests passed! Your AI matchmaking system is working!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Make sure Python microservice is running on port 8001');
    console.log('   2. Make sure Node.js backend is running on port 8000');
    console.log('   3. Check that node-fetch is installed: npm install node-fetch');
    console.log('   4. Verify .env has: AI_MICROSERVICE_URL=http://localhost:8001\n');
    process.exit(1);
  }
}

// Run the test
testMatchmaking();
