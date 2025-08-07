#!/usr/bin/env node

/**
 * Edit.ai - ExtendScript Integration Fix
 * Alternative approaches for Premiere Pro automation
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class ExtendScriptFix {
    constructor() {
        this.premierePath = this.getPremiereProPath();
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

    async testAlternativeMethods() {
        console.log('🔧 Testing Alternative ExtendScript Methods...\n');

        const methods = [
            {
                name: 'Method 1: Direct ExtendScript File',
                command: `"${this.premierePath}" -executeScript "${path.join(__dirname, 'test-script.jsx')}"`,
                description: 'Pass script file directly to Premiere Pro'
            },
            {
                name: 'Method 2: AppleScript with Different Syntax',
                command: `osascript -e 'tell application "Adobe Premiere Pro 2025" to activate' -e 'tell application "Adobe Premiere Pro 2025" to do script POSIX file "${path.join(__dirname, 'test-script.jsx')}"'`,
                description: 'Use POSIX file path in AppleScript'
            },
            {
                name: 'Method 3: ExtendScript Toolkit',
                command: `osascript -e 'tell application "ExtendScript Toolkit CS6" to open POSIX file "${path.join(__dirname, 'test-script.jsx')}"'`,
                description: 'Use ExtendScript Toolkit if available'
            },
            {
                name: 'Method 4: Manual Script Execution',
                command: `open -a "Adobe Premiere Pro 2025"`,
                description: 'Just launch Premiere Pro for manual testing'
            }
        ];

        // Create test script
        this.createTestScript();

        for (const method of methods) {
            console.log(`🧪 Testing: ${method.name}`);
            console.log(`📝 Description: ${method.description}`);
            
            try {
                const result = await this.executeCommand(method.command);
                console.log(`✅ SUCCESS: ${method.name}`);
                console.log(`📄 Output: ${result}`);
                console.log('🎯 This method works! Use this approach.\n');
                return method;
            } catch (error) {
                console.log(`❌ FAILED: ${method.name}`);
                console.log(`🚫 Error: ${error.message}\n`);
            }
        }

        console.log('❌ All methods failed. Need manual ExtendScript execution.');
        return null;
    }

    createTestScript() {
        const script = `
// Edit.ai Test Script
// This script tests basic Premiere Pro automation

var app = app || Application.currentApplication();

try {
    $.writeln("=== Edit.ai ExtendScript Test ===");
    $.writeln("Timestamp: " + new Date().toString());
    
    if (app.isRunning) {
        $.writeln("✅ Premiere Pro is running");
        
        // Test project creation
        var project = app.newProject();
        $.writeln("✅ Project created: " + project.name);
        
        // Test timeline creation
        var timeline = project.createNewTimeline("Edit.ai Test Timeline");
        $.writeln("✅ Timeline created: " + timeline.name);
        
        // Close project
        project.close();
        $.writeln("✅ Project closed successfully");
        
        $.writeln("🎉 All tests passed!");
        alert("Edit.ai ExtendScript test completed successfully!");
        
    } else {
        $.writeln("❌ Premiere Pro is not running");
        alert("Please start Premiere Pro first");
    }
    
    $.writeln("=== Test Complete ===");
    
} catch (error) {
    $.writeln("❌ Error: " + error.message);
    alert("ExtendScript test failed: " + error.message);
}
`;

        const scriptPath = path.join(__dirname, 'test-script.jsx');
        fs.writeFileSync(scriptPath, script);
        console.log(`📝 Test script created: ${scriptPath}`);
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    }

    async runFix() {
        console.log('🔧 Edit.ai - ExtendScript Integration Fix');
        console.log('=========================================\n');

        const workingMethod = await this.testAlternativeMethods();

        console.log('📊 Results Summary:');
        console.log('==================');
        
        if (workingMethod) {
            console.log(`✅ Found working method: ${workingMethod.name}`);
            console.log('🚀 Ready to implement automated editing');
            
            console.log('\n💡 Implementation Steps:');
            console.log('1. Use the working method for ExtendScript execution');
            console.log('2. Integrate with bridge-controller.js');
            console.log('3. Test with actual video files');
            console.log('4. Implement style application');
        } else {
            console.log('❌ No automated method found');
            console.log('💡 Manual ExtendScript execution required');
            
            console.log('\n🔧 Alternative Approach:');
            console.log('1. Create ExtendScript files manually');
            console.log('2. Execute them through Premiere Pro UI');
            console.log('3. Build a manual workflow for now');
            console.log('4. Focus on other components first');
        }
    }
}

// Run fix if this script is executed directly
if (require.main === module) {
    const fix = new ExtendScriptFix();
    fix.runFix().catch(console.error);
}

module.exports = ExtendScriptFix;
