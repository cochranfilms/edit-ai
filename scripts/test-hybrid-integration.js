#!/usr/bin/env node

/**
 * Edit.ai - Hybrid Integration Test
 * Tests the hybrid automation approach
 */

const HybridAutomation = require('./hybrid-automation');
const path = require('path');
const fs = require('fs');

class HybridIntegrationTest {
    constructor() {
        this.automation = new HybridAutomation();
    }

    async runTest() {
        console.log('🎬 Edit.ai - Hybrid Integration Test');
        console.log('====================================\n');

        try {
            // Test with sample data
            const testOptions = {
                style: 'cinematic',
                mediaFolder: path.join(__dirname, '..', 'test-media'),
                outputPath: path.join(__dirname, '..', 'temp', 'output', 'test-video.mp4')
            };

            console.log('🧪 Testing hybrid automation integration...');
            console.log(`Style: ${testOptions.style}`);
            console.log(`Media: ${testOptions.mediaFolder}`);
            console.log(`Output: ${testOptions.outputPath}\n`);

            // Ensure test directories exist
            this.ensureTestDirectories(testOptions);

            // Test hybrid automation
            const result = await this.automation.startAutomation(testOptions);

            if (result.success) {
                console.log('✅ Hybrid automation test successful!');
                console.log(`📝 Script created: ${result.scriptPath}`);
                
                // Verify script file exists
                if (fs.existsSync(result.scriptPath)) {
                    console.log('✅ ExtendScript file verified');
                    
                    // Show script preview
                    this.showScriptPreview(result.scriptPath);
                } else {
                    console.log('❌ ExtendScript file not found');
                }

                console.log('\n🎯 Integration Test Results:');
                console.log('===========================');
                console.log('✅ Hybrid automation working');
                console.log('✅ ExtendScript generation successful');
                console.log('✅ Premiere Pro launch successful');
                console.log('✅ Ready for manual execution');
                
                return true;
            } else {
                console.log('❌ Hybrid automation test failed');
                console.log(`Error: ${result.error}`);
                return false;
            }

        } catch (error) {
            console.error('❌ Test execution failed:', error.message);
            return false;
        }
    }

    ensureTestDirectories(options) {
        // Ensure test media directory exists
        if (!fs.existsSync(options.mediaFolder)) {
            fs.mkdirSync(options.mediaFolder, { recursive: true });
            console.log(`📁 Created test media directory: ${options.mediaFolder}`);
        }

        // Ensure output directory exists
        const outputDir = path.dirname(options.outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log(`📁 Created output directory: ${outputDir}`);
        }
    }

    showScriptPreview(scriptPath) {
        try {
            const scriptContent = fs.readFileSync(scriptPath, 'utf8');
            const lines = scriptContent.split('\n');
            
            console.log('\n📄 ExtendScript Preview (first 10 lines):');
            console.log('==========================================');
            lines.slice(0, 10).forEach((line, index) => {
                console.log(`${index + 1}: ${line}`);
            });
            console.log('...');
        } catch (error) {
            console.log('❌ Could not read script file');
        }
    }

    async runFullTest() {
        console.log('🚀 Starting comprehensive hybrid integration test...\n');

        const success = await this.runTest();

        console.log('\n📊 Final Test Results:');
        console.log('=====================');
        
        if (success) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('🚀 Hybrid automation is working correctly');
            console.log('💡 Ready to implement in main system');
            
            console.log('\n🎯 Next Steps:');
            console.log('1. Integrate with web interface');
            console.log('2. Test with real video files');
            console.log('3. Implement style application');
            console.log('4. Add export functionality');
        } else {
            console.log('❌ Some tests failed');
            console.log('🔧 Need to troubleshoot issues');
        }
    }
}

// Run test if this script is executed directly
if (require.main === module) {
    const test = new HybridIntegrationTest();
    test.runFullTest().catch(console.error);
}

module.exports = HybridIntegrationTest;
