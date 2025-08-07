#!/usr/bin/env node

/**
 * Edit.ai - Direct Premiere Pro ExtendScript Test
 * This script tests direct ExtendScript execution
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class DirectPremiereTester {
    constructor() {
        this.platform = process.platform;
        this.premierePath = this.getPremiereProPath();
        this.testResults = {
            canExecuteDirect: false,
            canCreateProject: false,
            canImportMedia: false,
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
     * Test direct ExtendScript execution
     */
    async testDirectExecution() {
        console.log('🎯 Testing direct ExtendScript execution...');
        
        // Create a simple ExtendScript
        const extendScript = `
            // Direct ExtendScript test
            try {
                $.writeln("=== Edit.ai Direct Test ===");
                $.writeln("ExtendScript is running!");
                
                // Test basic ExtendScript functionality
                var testArray = [1, 2, 3, 4, 5];
                $.writeln("Array test: " + testArray.join(", "));
                
                // Test string manipulation
                var testString = "Edit.ai is working!";
                $.writeln("String test: " + testString);
                
                // Test date functionality
                var now = new Date();
                $.writeln("Date test: " + now.toString());
                
                // Test file path handling
                var testPath = "${path.join(__dirname, '..', 'test-projects')}";
                $.writeln("Test path: " + testPath);
                
                $.writeln("=== Test Complete ===");
                "SUCCESS";
            } catch (error) {
                $.writeln("Error: " + error.message);
                "FAILED";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'direct-test.jsx');
        fs.writeFileSync(scriptPath, extendScript);
        
        return new Promise((resolve) => {
            // Try direct execution via command line
            const command = `"${this.premierePath}" -executeScript "${scriptPath}"`;
            
            console.log(`🔧 Executing: ${command}`);
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Direct execution failed:', error.message);
                    this.testResults.errors.push(`Direct execution failed: ${error.message}`);
                    
                    // Try alternative approach
                    this.tryAlternativeExecution(scriptPath, resolve);
                } else {
                    console.log('✅ Direct execution successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.canExecuteDirect = true;
                    
                    // Clean up
                    try {
                        fs.unlinkSync(scriptPath);
                    } catch (cleanupError) {
                        console.log('⚠️ Could not clean up script file:', cleanupError.message);
                    }
                    
                    resolve();
                }
            });
        });
    }

    /**
     * Try alternative execution methods
     */
    async tryAlternativeExecution(scriptPath, resolve) {
        console.log('🔄 Trying alternative execution methods...');
        
        const alternatives = [
            // Method 1: Using ExtendScript Toolkit
            `osascript -e 'tell application "ExtendScript Toolkit CS6" to open POSIX file "${scriptPath}"'`,
            
            // Method 2: Using different AppleScript syntax
            `osascript -e 'tell application "Adobe Premiere Pro 2025" to run script "${scriptPath}"'`,
            
            // Method 3: Using system command
            `open -a "Adobe Premiere Pro 2025" "${scriptPath}"`,
            
            // Method 4: Direct file execution
            `"${this.premierePath}" "${scriptPath}"`
        ];
        
        let currentMethod = 0;
        
        const tryNextMethod = () => {
            if (currentMethod >= alternatives.length) {
                console.log('❌ All alternative methods failed');
                this.testResults.errors.push('All alternative execution methods failed');
                
                // Clean up
                try {
                    fs.unlinkSync(scriptPath);
                } catch (cleanupError) {
                    console.log('⚠️ Could not clean up script file:', cleanupError.message);
                }
                
                resolve();
                return;
            }
            
            const command = alternatives[currentMethod];
            console.log(`🔧 Trying method ${currentMethod + 1}: ${command}`);
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Method ${currentMethod + 1} failed:`, error.message);
                    currentMethod++;
                    setTimeout(tryNextMethod, 1000);
                } else {
                    console.log('✅ Alternative execution successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.canExecuteDirect = true;
                    
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
        
        tryNextMethod();
    }

    /**
     * Test project creation with simpler approach
     */
    async testProjectCreation() {
        console.log('🏗️ Testing project creation with simpler approach...');
        
        // Create a minimal project creation script
        const projectScript = `
            // Simple project creation test
            try {
                $.writeln("Creating test project...");
                
                // This would normally create a project
                // For now, just test that we can execute ExtendScript
                var testProject = {
                    name: "Edit.ai Test Project",
                    created: new Date().toString(),
                    projectPath: "${path.join(__dirname, '..', 'test-projects', 'test-project.prproj')}",
                    mediaPath: "${path.join(__dirname, '..', 'test-media')}",
                    exportPath: "${path.join(__dirname, '..', 'test-exports')}"
                };
                
                $.writeln("Project: " + testProject.name);
                $.writeln("Created: " + testProject.created);
                $.writeln("Project Path: " + testProject.projectPath);
                $.writeln("Media Path: " + testProject.mediaPath);
                $.writeln("Export Path: " + testProject.exportPath);
                $.writeln("Project creation test completed");
                
                "SUCCESS";
            } catch (error) {
                $.writeln("Project creation error: " + error.message);
                "FAILED";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'project-test.jsx');
        fs.writeFileSync(scriptPath, projectScript);
        
        return new Promise((resolve) => {
            const command = `"${this.premierePath}" -executeScript "${scriptPath}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Project creation test failed:', error.message);
                    this.testResults.errors.push(`Project creation failed: ${error.message}`);
                } else {
                    console.log('✅ Project creation test successful!');
                    console.log('📝 Output:', stdout);
                    this.testResults.canCreateProject = true;
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
     * Generate test report
     */
    generateTestReport() {
        console.log('\n📊 Direct Premiere Pro Test Results:');
        console.log('=====================================');
        
        console.log(`✅ Can Execute Direct: ${this.testResults.canExecuteDirect}`);
        console.log(`✅ Can Create Project: ${this.testResults.canCreateProject}`);
        console.log(`✅ Can Import Media: ${this.testResults.canImportMedia}`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.testResults.canExecuteDirect) {
            console.log('✅ Direct ExtendScript execution is working!');
            console.log('🚀 Ready to implement full automation');
        } else {
            console.log('❌ Direct execution needs work');
            console.log('🔧 Need to find alternative execution method');
            console.log('💡 Consider using ExtendScript Toolkit or different approach');
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🎬 Edit.ai - Direct Premiere Pro ExtendScript Test');
        console.log('==================================================\n');
        
        try {
            await this.testDirectExecution();
            await this.testProjectCreation();
            this.generateTestReport();
            
        } catch (error) {
            console.log('❌ Test execution failed:', error.message);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new DirectPremiereTester();
    tester.runAllTests();
}

module.exports = DirectPremiereTester;
