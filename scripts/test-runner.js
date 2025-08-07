#!/usr/bin/env node

/**
 * Edit.ai - Test Runner
 * Runs all tests and generates comprehensive report
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class TestRunner {
    constructor() {
        this.testResults = {
            passed: 0,
            failed: 0,
            total: 0,
            errors: [],
            details: {}
        };
        this.testScripts = [
            'quick-test.js',
            'test-basic-integration.js',
            'test-extendscript-toolkit.js',
            'comprehensive-test-suite.js'
        ];
    }

    async runTest(scriptName) {
        console.log(`\n🧪 Running ${scriptName}...`);
        
        return new Promise((resolve) => {
            const scriptPath = path.join(__dirname, scriptName);
            
            if (!fs.existsSync(scriptPath)) {
                console.log(`❌ Test script not found: ${scriptName}`);
                this.testResults.failed++;
                this.testResults.errors.push(`Script not found: ${scriptName}`);
                resolve(false);
                return;
            }

            exec(`node "${scriptPath}"`, { timeout: 30000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ ${scriptName} failed:`, error.message);
                    this.testResults.failed++;
                    this.testResults.errors.push(`${scriptName}: ${error.message}`);
                    resolve(false);
                } else {
                    console.log(`✅ ${scriptName} passed`);
                    this.testResults.passed++;
                    this.testResults.details[scriptName] = stdout;
                    resolve(true);
                }
            });
        });
    }

    async runAllTests() {
        console.log('🎬 Edit.ai - Test Runner');
        console.log('========================\n');

        console.log('🚀 Starting comprehensive test suite...\n');

        for (const script of this.testScripts) {
            await this.runTest(script);
            this.testResults.total++;
            
            // Small delay between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.generateReport();
    }

    generateReport() {
        console.log('\n📊 Test Results Summary');
        console.log('=======================');
        console.log(`✅ Passed: ${this.testResults.passed}`);
        console.log(`❌ Failed: ${this.testResults.failed}`);
        console.log(`📈 Total: ${this.testResults.total}`);
        console.log(`📊 Success Rate: ${((this.testResults.passed / this.testResults.total) * 100).toFixed(1)}%`);

        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }

        console.log('\n🎯 Status:');
        if (this.testResults.failed === 0) {
            console.log('🎉 ALL TESTS PASSED!');
            console.log('🚀 Edit.ai is ready for development');
        } else if (this.testResults.passed > 0) {
            console.log('⚠️ Some tests passed, some failed');
            console.log('🔧 Review errors and fix issues');
        } else {
            console.log('❌ All tests failed');
            console.log('🚨 Critical issues need attention');
        }

        console.log('\n📋 Next Steps:');
        if (this.testResults.passed >= 2) {
            console.log('✅ Core functionality verified');
            console.log('🚀 Ready to proceed with creator platform');
            console.log('💡 Focus on ExtendScript integration');
        } else {
            console.log('🔧 Fix failing tests first');
            console.log('💡 Check dependencies and configurations');
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const runner = new TestRunner();
    runner.runAllTests().catch(console.error);
}

module.exports = TestRunner;
