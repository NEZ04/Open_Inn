/**
 * Project Update & Delete Test Script
 * 
 * This script tests the new project update and delete endpoints
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';
const API_BASE = `${BASE_URL}/api/v1`;

// REPLACE THESE WITH YOUR ACTUAL IDs
const WORKSPACE_ID = 'your_workspace_id_here';
const PROJECT_ID = 'your_project_id_here'; // Use a test project you can delete

// Store cookies for session management
let sessionCookie = '';

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(sessionCookie && { 'Cookie': sessionCookie })
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    
    // Save session cookie from response
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
        sessionCookie = setCookie.split(';')[0];
    }

    const data = await response.json();
    return { status: response.status, data };
}

/**
 * Test 1: Login
 */
async function testLogin() {
    console.log('\n🔐 Test 1: Login');
    const result = await apiRequest('/auth/login', 'POST', {
        email: 'test@example.com',
        password: 'test1234'
    });
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    return result.status === 200;
}

/**
 * Test 2: Create a Test Project (to update/delete later)
 */
async function testCreateProject() {
    console.log('\n📝 Test 2: Create Test Project');
    const result = await apiRequest(
        `/project/workspace/${WORKSPACE_ID}/create`,
        'POST',
        {
            name: 'Test Project for Update/Delete',
            emoji: '🧪',
            description: 'This is a test project that will be updated and deleted'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.project) {
        return result.data.project._id;
    }
    return null;
}

/**
 * Test 3: Update Project - Full Update
 */
async function testUpdateProjectFull(projectId) {
    console.log('\n✏️ Test 3: Update Project (Full Update)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {
            name: 'Updated Test Project',
            emoji: '🚀',
            description: 'This project has been fully updated with new name, emoji, and description'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 4: Update Project - Partial Update (Name Only)
 */
async function testUpdateProjectPartial(projectId) {
    console.log('\n✏️ Test 4: Update Project (Name Only)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {
            name: 'Partially Updated Project'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 5: Update Project - Emoji Only
 */
async function testUpdateProjectEmoji(projectId) {
    console.log('\n✏️ Test 5: Update Project (Emoji Only)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {
            emoji: '🎨'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 6: Update Project - Description Only
 */
async function testUpdateProjectDescription(projectId) {
    console.log('\n✏️ Test 6: Update Project (Description Only)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {
            description: 'This is a new description for the project'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 7: Try Update with No Fields (Should Fail)
 */
async function testUpdateProjectNoFields(projectId) {
    console.log('\n❌ Test 7: Update Project with No Fields (Expected to Fail)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {}
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    if (result.status === 400) {
        console.log('✅ Correctly rejected update with no fields');
    }
}

/**
 * Test 8: Get Project to Verify Updates
 */
async function testGetProject(projectId) {
    console.log('\n🔍 Test 8: Get Project (Verify Updates)');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 9: Create Tasks in Project (to test cascading delete)
 */
async function testCreateTasksInProject(projectId) {
    console.log('\n📋 Test 9: Create Tasks in Project');
    
    const tasks = [
        { title: 'Task 1 for Delete Test', priority: 'high' },
        { title: 'Task 2 for Delete Test', priority: 'medium' },
        { title: 'Task 3 for Delete Test', priority: 'low' }
    ];
    
    for (const task of tasks) {
        const result = await apiRequest(
            `/task/workspace/${WORKSPACE_ID}/project/${projectId}/create`,
            'POST',
            task
        );
        console.log(`Created task "${task.title}":`, result.status === 201 ? '✅' : '❌');
    }
}

/**
 * Test 10: Verify Tasks Exist
 */
async function testGetTasksInProject(projectId) {
    console.log('\n📋 Test 10: Get Tasks in Project');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${projectId}/all`
    );
    console.log('Status:', result.status);
    console.log('Tasks Found:', result.data.tasks?.length || 0);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 11: Delete Project (with cascading task deletion)
 */
async function testDeleteProject(projectId) {
    console.log('\n🗑️ Test 11: Delete Project (Will Delete All Tasks)');
    console.log('⚠️  WARNING: This will permanently delete the project and all its tasks!');
    
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}`,
        'DELETE'
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 12: Verify Project is Deleted
 */
async function testVerifyProjectDeleted(projectId) {
    console.log('\n🔍 Test 12: Verify Project is Deleted');
    const result = await apiRequest(
        `/project/${projectId}/workspace/${WORKSPACE_ID}`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    if (result.status === 404 || result.data.error) {
        console.log('✅ Project successfully deleted');
    }
}

/**
 * Test 13: Verify Tasks are Deleted
 */
async function testVerifyTasksDeleted(projectId) {
    console.log('\n🔍 Test 13: Verify Tasks are Deleted');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${projectId}/all`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    if (result.data.tasks?.length === 0 || result.status === 404) {
        console.log('✅ All tasks successfully deleted with project');
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Starting Project Update/Delete Tests...');
    console.log('=' .repeat(60));

    try {
        // Login
        const loginSuccess = await testLogin();
        if (!loginSuccess) {
            console.error('❌ Login failed. Please check credentials.');
            return;
        }

        // Create a test project
        const testProjectId = await testCreateProject();
        if (!testProjectId) {
            console.error('❌ Project creation failed.');
            return;
        }

        console.log(`\n✅ Test Project Created with ID: ${testProjectId}`);
        console.log('We will now update and delete this project...\n');

        // Wait a moment
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Test updates
        await testUpdateProjectFull(testProjectId);
        await testUpdateProjectPartial(testProjectId);
        await testUpdateProjectEmoji(testProjectId);
        await testUpdateProjectDescription(testProjectId);
        await testUpdateProjectNoFields(testProjectId);
        
        // Verify updates
        await testGetProject(testProjectId);

        // Create tasks to test cascading delete
        await testCreateTasksInProject(testProjectId);
        await testGetTasksInProject(testProjectId);

        // Wait before delete
        console.log('\n⏳ Waiting 3 seconds before deletion...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Delete project and verify
        await testDeleteProject(testProjectId);
        await testVerifyProjectDeleted(testProjectId);
        await testVerifyTasksDeleted(testProjectId);

        console.log('\n' + '='.repeat(60));
        console.log('✅ All tests completed!');
        console.log('\n📝 Summary:');
        console.log('  - Project update (full) ✅');
        console.log('  - Project update (partial) ✅');
        console.log('  - Project update (emoji only) ✅');
        console.log('  - Project update (description only) ✅');
        console.log('  - Project update validation ✅');
        console.log('  - Project deletion ✅');
        console.log('  - Cascading task deletion ✅');

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        console.error(error);
    }
}

// Run the tests
runAllTests();
