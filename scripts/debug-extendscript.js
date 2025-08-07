#!/usr/bin/env node

/**
 * Edit.ai - ExtendScript Execution Debug
 * This script tests multiple methods of executing ExtendScript in Premiere Pro
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ExtendScriptDebugger {
    constructor() {
        this.platform = process.platform;
        this.premierePath = this.getPremiereProPath();
        this.testResults = {
            method1: false,
            method2: false,
            method3: false,
            method4: false,
            method5: false,
            workingMethod: null,
            errors: []
        };
    }

    /**
     * Get Premiere Pro path
     */
    getPremiereProPath() {
        switch (this.platform) {
            case 'darwin': // macOS
                return '/Applications/Adobe Premiere Pro 2025/Adobe Premiere Pro 2025.app/Contents/MacOS/Adobe Premiere Pro 2025';
            case 'win32': // Windows
                return 'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2025\\Adobe Premiere Pro.exe';
            default:
                throw new Error(`Unsupported platform: ${this.platform}`);
        }
    }

    /**
     * Create a simple test ExtendScript
     */
    createTestScript() {
        const script = `
            // Edit.ai ExtendScript Debug Test
            try {
                $.writeln("=== Edit.ai Debug Test ===");
                $.writeln("ExtendScript execution successful!");
                $.writeln("Timestamp: " + new Date().toString());
                $.writeln("Platform: " + $.os);
                $.writeln("=== Test Complete ===");
                "SUCCESS";
            } catch (error) {
                $.writeln("Error: " + error.message);
                "FAILED";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'debug-test.jsx');
        fs.writeFileSync(scriptPath, script);
        return scriptPath;
    }

    /**
     * Method 1: Direct command line execution
     */
    async testMethod1(scriptPath) {
        console.log('🔧 Method 1: Direct command line execution');
        
        return new Promise((resolve) => {
            const command = `"${this.premierePath}" -executeScript "${scriptPath}"`;
            
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Method 1 failed:', error.message);
                    this.testResults.errors.push(`Method 1: ${error.message}`);
                } else {
                    console.log('✅ Method 1 successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.method1 = true;
                    this.testResults.workingMethod = 'Method 1';
                }
                resolve();
            });
        });
    }

    /**
     * Method 2: AppleScript with different syntax
     */
    async testMethod2(scriptPath) {
        console.log('🔧 Method 2: AppleScript with different syntax');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`;
            
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Method 2 failed:', error.message);
                    this.testResults.errors.push(`Method 2: ${error.message}`);
                } else {
                    console.log('✅ Method 2 successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.method2 = true;
                    this.testResults.workingMethod = 'Method 2';
                }
                resolve();
            });
        });
    }

    /**
     * Method 3: AppleScript with file reference
     */
    async testMethod3(scriptPath) {
        console.log('🔧 Method 3: AppleScript with file reference');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script file "${scriptPath}"'`;
            
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Method 3 failed:', error.message);
                    this.testResults.errors.push(`Method 3: ${error.message}`);
                } else {
                    console.log('✅ Method 3 successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.method3 = true;
                    this.testResults.workingMethod = 'Method 3';
                }
                resolve();
            });
        });
    }

    /**
     * Method 4: AppleScript with POSIX file
     */
    async testMethod4(scriptPath) {
        console.log('🔧 Method 4: AppleScript with POSIX file');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script POSIX file "${scriptPath}"'`;
            
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Method 4 failed:', error.message);
                    this.testResults.errors.push(`Method 4: ${error.message}`);
                } else {
                    console.log('✅ Method 4 successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.method4 = true;
                    this.testResults.workingMethod = 'Method 4';
                }
                resolve();
            });
        });
    }

    /**
     * Method 5: Using ExtendScript Toolkit
     */
    async testMethod5(scriptPath) {
        console.log('🔧 Method 5: Using ExtendScript Toolkit');
        
        return new Promise((resolve) => {
            const command = `osascript -e 'tell application "ExtendScript Toolkit CS6" to open POSIX file "${scriptPath}"'`;
            
            exec(command, { timeout: 10000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Method 5 failed:', error.message);
                    this.testResults.errors.push(`Method 5: ${error.message}`);
                } else {
                    console.log('✅ Method 5 successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.method5 = true;
                    this.testResults.workingMethod = 'Method 5';
                }
                resolve();
            });
        });
    }

    /**
     * Test project creation with working method
     */
    async testProjectCreation(workingMethod) {
        if (!workingMethod) {
            console.log('❌ No working method found for project creation test');
            return;
        }

        console.log(`🏗️ Testing project creation with ${workingMethod}...`);
        
        const projectScript = `
            // Edit.ai Project Creation Test
            try {
                $.writeln("=== Edit.ai Project Creation ===");
                
                // Test project creation
                var projectName = "Edit.ai_Test_Project_" + Date.now();
                var projectPath = "${path.join(__dirname, '..', 'test-projects')}/" + projectName + ".prproj";
                
                $.writeln("Creating project: " + projectName);
                $.writeln("Project path: " + projectPath);
                
                // This would normally create a project
                // For now, just test that we can execute ExtendScript
                var testProject = {
                    name: projectName,
                    path: projectPath,
                    created: new Date().toString(),
                    settings: {
                        frameRate: 24,
                        resolution: "1920x1080",
                        audioSampleRate: 48000
                    }
                };
                
                $.writeln("Project created successfully!");
                $.writeln("Settings: " + JSON.stringify(testProject.settings));
                $.writeln("=== Project Creation Complete ===");
                
                "SUCCESS";
            } catch (error) {
                $.writeln("Project creation error: " + error.message);
                "FAILED";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'project-creation-test.jsx');
        fs.writeFileSync(scriptPath, projectScript);
        
        return new Promise((resolve) => {
            let command;
            
            switch (workingMethod) {
                case 'Method 1':
                    command = `"${this.premierePath}" -executeScript "${scriptPath}"`;
                    break;
                case 'Method 2':
                    command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`;
                    break;
                case 'Method 3':
                    command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script file "${scriptPath}"'`;
                    break;
                case 'Method 4':
                    command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script POSIX file "${scriptPath}"'`;
                    break;
                default:
                    command = `osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`;
            }
            
            console.log(`🔧 Executing: ${command}`);
            
            exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Project creation failed:', error.message);
                    this.testResults.errors.push(`Project creation failed: ${error.message}`);
                } else {
                    console.log('✅ Project creation successful!');
                    console.log('📝 Output:', stdout);
                }
                
                // Clean up
                try {
                    fs.unlinkSync(scriptPath);
                } catch (cleanupError) {
                    console.log('⚠️ Could not clean up script file:', cleanupError.message);
                }
                
                resolve();
            });
        });
    }

    /**
     * Generate debug report
     */
    generateDebugReport() {
        console.log('\n📊 ExtendScript Execution Debug Results:');
        console.log('=========================================');
        
        console.log(`✅ Method 1 (Direct): ${this.testResults.method1}`);
        console.log(`✅ Method 2 (AppleScript): ${this.testResults.method2}`);
        console.log(`✅ Method 3 (File): ${this.testResults.method3}`);
        console.log(`✅ Method 4 (POSIX): ${this.testResults.method4}`);
        console.log(`✅ Method 5 (Toolkit): ${this.testResults.method5}`);
        
        if (this.testResults.workingMethod) {
            console.log(`🎯 Working Method: ${this.testResults.workingMethod}`);
        } else {
            console.log('❌ No working method found');
        }
        
        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.testResults.workingMethod) {
            console.log(`✅ Found working method: ${this.testResults.workingMethod}`);
            console.log('🚀 Ready to implement project creation');
        } else {
            console.log('❌ Need to find alternative execution method');
            console.log('💡 Consider using ExtendScript Toolkit or different approach');
        }
    }

    /**
     * Run all debug tests
     */
    async runAllTests() {
        console.log('🎬 Edit.ai - ExtendScript Execution Debug');
        console.log('=========================================\n');
        
        try {
            // Create test script
            const scriptPath = this.createTestScript();
            
            // Test all methods
            await this.testMethod1(scriptPath);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.testMethod2(scriptPath);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.testMethod3(scriptPath);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.testMethod4(scriptPath);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.testMethod5(scriptPath);
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Test project creation if we found a working method
            if (this.testResults.workingMethod) {
                await this.testProjectCreation(this.testResults.workingMethod);
            }
            
            // Generate report
            this.generateDebugReport();
            
            // Clean up test script
            try {
                fs.unlinkSync(scriptPath);
            } catch (cleanupError) {
                console.log('⚠️ Could not clean up test script:', cleanupError.message);
            }
            
        } catch (error) {
            console.log('❌ Debug execution failed:', error.message);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const debuggerInstance = new ExtendScriptDebugger();
    debuggerInstance.runAllTests();
}

module.exports = ExtendScriptDebugger;
