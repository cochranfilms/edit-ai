#!/usr/bin/env node

/**
 * Edit.ai - ExtendScript Toolkit Test
 * Tests proper ExtendScript integration with Premiere Pro
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class ExtendScriptTester {
    constructor() {
        this.premierePath = this.getPremiereProPath();
        this.scriptPath = path.join(__dirname, 'premiere-controller.jsx');
    }

    getPremiereProPath() {
        const platform = process.platform;
        if (platform === 'darwin') {
            return '/Applications/Adobe Premiere Pro 2025/Adobe Premiere Pro 2025.app/Contents/MacOS/Adobe Premiere Pro 2025';
        } else if (platform === 'win32') {
            return 'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2025\\Adobe Premiere Pro.exe';
        }
        throw new Error('Unsupported platform');
    }

    async testExtendScriptExecution() {
        console.log('🎬 Testing ExtendScript Execution...');
        
        try {
            // Create a simple test script
            const testScript = this.createTestScript();
            const testScriptPath = path.join(__dirname, 'test-simple.jsx');
            fs.writeFileSync(testScriptPath, testScript);

            // Execute with proper AppleScript syntax
            const command = this.buildAppleScriptCommand(testScriptPath);
            
            console.log('📝 Executing ExtendScript...');
            const result = await this.executeCommand(command);
            
            console.log('✅ ExtendScript execution successful');
            console.log('📄 Response:', result);
            
            // Cleanup
            fs.unlinkSync(testScriptPath);
            
            return true;
            
        } catch (error) {
            console.log('❌ ExtendScript execution failed:', error.message);
            return false;
        }
    }

    createTestScript() {
        return `
// Simple ExtendScript test for Premiere Pro
var app = app || Application.currentApplication();

try {
    // Test basic Premiere Pro access
    if (app.isRunning) {
        $.writeln("Premiere Pro is running");
        
        // Test project creation
        var project = app.newProject();
        $.writeln("Project created: " + project.name);
        
        // Close project
        project.close();
        $.writeln("Project closed successfully");
        
        alert("ExtendScript test completed successfully!");
    } else {
        $.writeln("Premiere Pro is not running");
        alert("Please start Premiere Pro first");
    }
} catch (error) {
    $.writeln("Error: " + error.message);
    alert("ExtendScript test failed: " + error.message);
}
`;
    }

    buildAppleScriptCommand(scriptPath) {
        // Use a single AppleScript command that should work
        return `osascript -e 'tell application "Adobe Premiere Pro 2025" to activate' -e 'tell application "Adobe Premiere Pro 2025" to do script POSIX file "${scriptPath}"'`;
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`Command failed: ${error.message}`));
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    }

    async runFullTest() {
        console.log('⚡ Edit.ai - ExtendScript Toolkit Test');
        console.log('=====================================\n');

        console.log('🔍 Testing ExtendScript Integration...');
        
        const success = await this.testExtendScriptExecution();
        
        console.log('\n📊 Test Results:');
        console.log('================');
        console.log(success ? '✅ ExtendScript Integration: WORKING' : '❌ ExtendScript Integration: FAILED');
        
        if (success) {
            console.log('\n🎉 ExtendScript integration is working!');
            console.log('🚀 Ready to proceed with automated editing');
        } else {
            console.log('\n🔧 Next steps:');
            console.log('1. Ensure Premiere Pro 2025 is installed');
            console.log('2. Check AppleScript permissions');
            console.log('3. Verify ExtendScript toolkit installation');
        }
    }
}

// Run the test
const tester = new ExtendScriptTester();
tester.runFullTest().catch(console.error);
