/**
 * Task Management System Test Script
 * 
 * This script tests all task-related endpoints
 * Make sure you have a valid workspace and project before running
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:8000';
const API_BASE = `${BASE_URL}/api/v1`;

// REPLACE THESE WITH YOUR ACTUAL IDs
const WORKSPACE_ID = 'your_workspace_id_here';
const PROJECT_ID = 'your_project_id_here';
const USER_ID = 'your_user_id_here';

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
 * Test 1: Login (required before testing tasks)
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
 * Test 2: Create Task
 */
async function testCreateTask() {
    console.log('\n📝 Test 2: Create Task');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${PROJECT_ID}/create`,
        'POST',
        {
            title: 'Test Task - Implement Feature X',
            description: 'This is a comprehensive test task to verify the task management system',
            status: 'todo',
            priority: 'high',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.task) {
        return result.data.task._id;
    }
    return null;
}

/**
 * Test 3: Get All Tasks
 */
async function testGetAllTasks() {
    console.log('\n📋 Test 3: Get All Tasks in Project');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${PROJECT_ID}/all?pageSize=10&pageNumber=1`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 4: Get Task by ID
 */
async function testGetTaskById(taskId) {
    console.log('\n🔍 Test 4: Get Task by ID');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 5: Update Task Status
 */
async function testUpdateTaskStatus(taskId) {
    console.log('\n✏️ Test 5: Update Task Status');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}/status`,
        'PUT',
        { status: 'in-progress' }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 6: Update Task Priority
 */
async function testUpdateTaskPriority(taskId) {
    console.log('\n⚡ Test 6: Update Task Priority');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}/priority`,
        'PUT',
        { priority: 'medium' }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 7: Assign Task
 */
async function testAssignTask(taskId) {
    console.log('\n👤 Test 7: Assign Task to User');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}/assign`,
        'PUT',
        { assignedTo: USER_ID }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 8: Update Task (full update)
 */
async function testUpdateTask(taskId) {
    console.log('\n🔄 Test 8: Update Task (Full Update)');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}/update`,
        'PUT',
        {
            title: 'Updated Task Title',
            description: 'Updated task description with more details',
            priority: 'low'
        }
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 9: Get My Tasks
 */
async function testGetMyTasks() {
    console.log('\n👨‍💼 Test 9: Get My Tasks');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/my-tasks?status=in-progress`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 10: Get Tasks by User
 */
async function testGetTasksByUser() {
    console.log('\n👥 Test 10: Get Tasks by User');
    const result = await apiRequest(
        `/task/user/${USER_ID}/workspace/${WORKSPACE_ID}`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 11: Get Task Analytics
 */
async function testGetTaskAnalytics() {
    console.log('\n📊 Test 11: Get Task Analytics');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${PROJECT_ID}/analytics`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 12: Filter Tasks
 */
async function testFilterTasks() {
    console.log('\n🔎 Test 12: Filter Tasks (High Priority, Todo Status)');
    const result = await apiRequest(
        `/task/workspace/${WORKSPACE_ID}/project/${PROJECT_ID}/all?status=todo&priority=high&pageSize=5`
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Test 13: Delete Task
 */
async function testDeleteTask(taskId) {
    console.log('\n🗑️ Test 13: Delete Task');
    const result = await apiRequest(
        `/task/${taskId}/workspace/${WORKSPACE_ID}`,
        'DELETE'
    );
    console.log('Status:', result.status);
    console.log('Response:', JSON.stringify(result.data, null, 2));
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('🚀 Starting Task Management System Tests...');
    console.log('=' .repeat(50));

    try {
        // Step 1: Login
        const loginSuccess = await testLogin();
        if (!loginSuccess) {
            console.error('❌ Login failed. Please check credentials.');
            return;
        }

        // Step 2: Create a task
        const taskId = await testCreateTask();
        if (!taskId) {
            console.error('❌ Task creation failed.');
            return;
        }

        // Step 3-12: Run all other tests
        await testGetAllTasks();
        await testGetTaskById(taskId);
        await testUpdateTaskStatus(taskId);
        await testUpdateTaskPriority(taskId);
        await testAssignTask(taskId);
        await testUpdateTask(taskId);
        await testGetMyTasks();
        await testGetTasksByUser();
        await testGetTaskAnalytics();
        await testFilterTasks();

        // Step 13: Delete the test task (optional - comment out if you want to keep it)
        // await testDeleteTask(taskId);

        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests completed!');
        console.log('\n💡 Note: Update WORKSPACE_ID, PROJECT_ID, and USER_ID at the top of this file');
        console.log('💡 Make sure to login with valid credentials first');

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
        console.error(error);
    }
}

// Run the tests
runAllTests();
