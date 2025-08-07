#!/usr/bin/env node

/**
 * Edit.ai - Simple Premiere Pro Communication Test
 * This script tests basic communication with Premiere Pro
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class SimplePremiereTester {
    constructor() {
        this.platform = process.platform;
        this.testResults = {
            canLaunch: false,
            canCommunicate: false,
            canExecuteScript: false,
            errors: []
        };
    }

    /**
     * Test if we can launch Premiere Pro
     */
    async testLaunch() {
        console.log('🚀 Testing Premiere Pro launch...');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to activate'`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Launch failed:', error.message);
                    this.testResults.errors.push(`Launch failed: ${error.message}`);
                } else {
                    console.log('✅ Premiere Pro launched successfully');
                    this.testResults.canLaunch = true;
                }
                resolve();
            });
        });
    }

    /**
     * Test basic communication
     */
    async testCommunication() {
        console.log('💬 Testing basic communication...');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to get name'`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Communication failed:', error.message);
                    this.testResults.errors.push(`Communication failed: ${error.message}`);
                } else {
                    console.log('✅ Communication successful');
                    console.log('📝 Response:', stdout.trim());
                    this.testResults.canCommunicate = true;
                }
                resolve();
            });
        });
    }

    /**
     * Test simple script execution
     */
    async testSimpleScript() {
        console.log('📝 Testing simple script execution...');
        
        // Create a very simple ExtendScript
        const simpleScript = `
            // Simple test script
            $.writeln("Hello from ExtendScript!");
            $.writeln("Premiere Pro is responding!");
            "SUCCESS";
        `;
        
        const scriptPath = path.join(__dirname, 'simple-test.jsx');
        fs.writeFileSync(scriptPath, simpleScript);
        
        return new Promise((resolve) => {
            // Try different approaches
            const approaches = [
                `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`,
                `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script file "${scriptPath}"'`,
                `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script POSIX file "${scriptPath}"'`
            ];
            
            let currentApproach = 0;
            
            const tryNextApproach = () => {
                if (currentApproach >= approaches.length) {
                    console.log('❌ All script execution approaches failed');
                    this.testResults.errors.push('All script execution approaches failed');
                    
                    // Clean up
                    try {
                        fs.unlinkSync(scriptPath);
                    } catch (cleanupError) {
                        console.log('⚠️ Could not clean up script file:', cleanupError.message);
                    }
                    
                    resolve();
                    return;
                }
                
                const command = approaches[currentApproach];
                console.log(`🔧 Trying approach ${currentApproach + 1}: ${command}`);
                
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`❌ Approach ${currentApproach + 1} failed:`, error.message);
                        currentApproach++;
                        setTimeout(tryNextApproach, 1000);
                    } else {
                        console.log('✅ Script execution successful!');
                        console.log('📝 Output:', stdout);
                        this.testResults.canExecuteScript = true;
                        
                        // Clean up
                        try {
                            fs.unlinkSync(scriptPath);
                        } catch (cleanupError) {
                            console.log('⚠️ Could not clean up script file:', cleanupError.message);
                        }
                        
                        resolve();
                    }
                });
            };
            
            tryNextApproach();
        });
    }

    /**
     * Generate test report
     */
    generateTestReport() {
        console.log('\n📊 Simple Premiere Pro Test Results:');
        console.log('=====================================');
        
        console.log(`✅ Can Launch: ${this.testResults.canLaunch}`);
        console.log(`✅ Can Communicate: ${this.testResults.canCommunicate}`);
        console.log(`✅ Can Execute Script: ${this.testResults.canExecuteScript}`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.testResults.canExecuteScript) {
            console.log('✅ Script execution is working!');
            console.log('🚀 Ready to implement full automation');
        } else if (this.testResults.canCommunicate) {
            console.log('✅ Communication is working!');
            console.log('🔧 Need to refine script execution method');
        } else {
            console.log('❌ Basic communication needs work');
            console.log('🔧 Need to debug Premiere Pro integration');
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🎬 Edit.ai - Simple Premiere Pro Communication Test');
        console.log('==================================================\n');
        
        try {
            await this.testLaunch();
            await this.testCommunication();
            await this.testSimpleScript();
            this.generateTestReport();
            
        } catch (error) {
            console.log('❌ Test execution failed:', error.message);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new SimplePremiereTester();
    tester.runAllTests();
}

module.exports = SimplePremiereTester;
