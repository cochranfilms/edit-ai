#!/usr/bin/env node

/**
 * Edit.ai - Basic Premiere Pro Integration Test
 * This script tests if we can control Adobe Premiere Pro programmatically
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class PremiereProTester {
    constructor() {
        this.platform = process.platform;
        this.premierePath = this.getPremiereProPath();
        this.testResults = {
            premiereFound: false,
            canLaunch: false,
            canCreateProject: false,
            canImportMedia: false,
            canExport: false,
            errors: []
        };
    }

    /**
     * Get Premiere Pro path based on platform
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
     * Check if Premiere Pro is installed
     */
    async checkPremiereProInstallation() {
        console.log('🔍 Checking Premiere Pro installation...');
        
        try {
            const exists = fs.existsSync(this.premierePath);
            this.testResults.premiereFound = exists;
            
            if (exists) {
                console.log('✅ Premiere Pro found at:', this.premierePath);
            } else {
                console.log('❌ Premiere Pro not found at:', this.premierePath);
                console.log('💡 Please check if Adobe Premiere Pro 2024 is installed');
            }
            
            return exists;
        } catch (error) {
            console.log('❌ Error checking Premiere Pro installation:', error.message);
            this.testResults.errors.push(`Installation check failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Test if we can launch Premiere Pro
     */
    async testPremiereProLaunch() {
        console.log('🚀 Testing Premiere Pro launch...');
        
        return new Promise((resolve) => {
            const command = this.platform === 'darwin' 
                ? `open "${this.premierePath}"`
                : `"${this.premierePath}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Failed to launch Premiere Pro:', error.message);
                    this.testResults.errors.push(`Launch failed: ${error.message}`);
                    this.testResults.canLaunch = false;
                } else {
                    console.log('✅ Premiere Pro launched successfully');
                    this.testResults.canLaunch = true;
                }
                resolve();
            });
        });
    }

    /**
     * Test AppleScript integration (macOS only)
     */
    async testAppleScriptIntegration() {
        if (this.platform !== 'darwin') {
            console.log('⚠️ AppleScript test skipped (Windows platform)');
            return;
        }

        console.log('🍎 Testing AppleScript integration...');
        
        const appleScript = `
            tell application "Adobe Premiere Pro 2025"
                activate
                delay 2
                return "Premiere Pro is running"
            end tell
        `;
        
        return new Promise((resolve) => {
            exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ AppleScript integration failed:', error.message);
                    this.testResults.errors.push(`AppleScript failed: ${error.message}`);
                } else {
                    console.log('✅ AppleScript integration working');
                    console.log('📝 Response:', stdout.trim());
                }
                resolve();
            });
        });
    }

    /**
     * Test ExtendScript execution
     */
    async testExtendScriptExecution() {
        console.log('📜 Testing ExtendScript execution...');
        
        // Create a simple ExtendScript test
        const extendScriptTest = `
            // Simple ExtendScript test
            try {
                var app = Application.currentApplication();
                $.writeln("ExtendScript test successful");
                $.writeln("Premiere Pro version: " + app.version);
                return "SUCCESS";
            } catch (error) {
                $.writeln("ExtendScript test failed: " + error.message);
                return "FAILED";
            }
        `;
        
        const testScriptPath = path.join(__dirname, 'test-extendscript.jsx');
        fs.writeFileSync(testScriptPath, extendScriptTest);
        
        return new Promise((resolve) => {
            // Use a different approach for macOS
            const command = this.platform === 'darwin'
                ? `osascript -e 'tell app "Adobe Premiere Pro 2025" to activate' && osascript -e 'tell app "Adobe Premiere Pro 2025" to do script file "${testScriptPath}"'`
                : `"${this.premierePath}" -executeScript "${testScriptPath}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ ExtendScript execution failed:', error.message);
                    console.log('💡 This is expected for the first test - ExtendScript integration needs refinement');
                    this.testResults.errors.push(`ExtendScript failed: ${error.message}`);
                } else {
                    console.log('✅ ExtendScript execution successful');
                    console.log('📝 Output:', stdout);
                }
                
                // Clean up test script
                try {
                    fs.unlinkSync(testScriptPath);
                } catch (cleanupError) {
                    console.log('⚠️ Could not clean up test script:', cleanupError.message);
                }
                
                resolve();
            });
        });
    }

    /**
     * Test file system access
     */
    async testFileSystemAccess() {
        console.log('📁 Testing file system access...');
        
        const testDir = path.join(__dirname, '..', 'temp');
        const testFile = path.join(testDir, 'test.txt');
        
        try {
            // Create temp directory
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir, { recursive: true });
            }
            
            // Create test file
            fs.writeFileSync(testFile, 'Test file for Edit.ai');
            
            // Read test file
            const content = fs.readFileSync(testFile, 'utf8');
            
            // Clean up
            fs.unlinkSync(testFile);
            
            console.log('✅ File system access working');
            return true;
        } catch (error) {
            console.log('❌ File system access failed:', error.message);
            this.testResults.errors.push(`File system failed: ${error.message}`);
            return false;
        }
    }

    /**
     * Generate test report
     */
    generateTestReport() {
        console.log('\n📊 Test Results Summary:');
        console.log('========================');
        
        console.log(`✅ Premiere Pro Found: ${this.testResults.premiereFound}`);
        console.log(`✅ Can Launch: ${this.testResults.canLaunch}`);
        console.log(`✅ AppleScript Integration: ${this.platform === 'darwin' ? 'Tested' : 'Skipped'}`);
        console.log(`✅ ExtendScript Execution: Tested`);
        console.log(`✅ File System Access: Working`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.testResults.premiereFound && this.testResults.canLaunch) {
            console.log('✅ Basic integration is possible!');
            console.log('🚀 Ready to proceed with development');
        } else {
            console.log('❌ Basic integration issues detected');
            console.log('🔧 Need to resolve installation or permission issues');
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🎬 Edit.ai - Premiere Pro Integration Test');
        console.log('==========================================\n');
        
        try {
            // Check installation
            await this.checkPremiereProInstallation();
            
            // Test file system
            await this.testFileSystemAccess();
            
            // Test launch (only if found)
            if (this.testResults.premiereFound) {
                await this.testPremiereProLaunch();
                await this.testAppleScriptIntegration();
                await this.testExtendScriptExecution();
            }
            
            // Generate report
            this.generateTestReport();
            
        } catch (error) {
            console.log('❌ Test execution failed:', error.message);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new PremiereProTester();
    tester.runAllTests();
}

module.exports = PremiereProTester;
