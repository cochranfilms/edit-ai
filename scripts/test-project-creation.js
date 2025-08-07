#!/usr/bin/env node

/**
 * Edit.ai - Project Creation & Media Import Test
 * This script tests creating Premiere Pro projects and importing media
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProjectCreationTester {
    constructor() {
        this.platform = process.platform;
        this.premierePath = this.getPremiereProPath();
        this.testResults = {
            projectCreated: false,
            mediaImported: false,
            timelineCreated: false,
            exportSuccessful: false,
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
     * Create a test video file
     */
    async createTestVideo() {
        console.log('🎬 Creating test video file...');
        
        const testVideoPath = path.join(__dirname, '..', 'temp', 'test-video.mp4');
        const testDir = path.dirname(testVideoPath);
        
        // Create temp directory if it doesn't exist
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        
        // Create a simple test video using FFmpeg
        const ffmpegCommand = `ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -c:v libx264 -preset fast -crf 23 "${testVideoPath}" -y`;
        
        return new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Failed to create test video:', error.message);
                    reject(error);
                } else {
                    console.log('✅ Test video created successfully');
                    resolve(testVideoPath);
                }
            });
        });
    }

    /**
     * Create ExtendScript for project creation
     */
    createProjectExtendScript(testVideoPath) {
        const projectName = `Edit.ai_Test_${Date.now()}`;
        const projectPath = path.join(__dirname, '..', 'temp', `${projectName}.prproj`);
        
        const extendScript = `
            // Edit.ai Project Creation Test
            try {
                // Get the application
                var app = Application.currentApplication();
                
                // Create new project
                var project = app.newProject();
                project.name = "${projectName}";
                
                // Set project settings
                project.videoFrameRate = 24;
                project.videoFrameSize = "1920x1080";
                project.audioSampleRate = 48000;
                project.audioChannels = 2;
                
                // Create timeline
                var timeline = project.createNewTimeline("Auto-Edited Timeline");
                
                // Import media
                var mediaItem = project.importFiles(["${testVideoPath}"], false, project.rootItem, false);
                
                if (mediaItem && mediaItem.length > 0) {
                    // Add to timeline
                    var videoTrack = timeline.getVideoTracks()[0];
                    videoTrack.insertClip(mediaItem[0], 0);
                    
                    $.writeln("Project created successfully");
                    $.writeln("Media imported successfully");
                    $.writeln("Timeline created successfully");
                    
                    // Save project
                    project.saveAs("${projectPath}");
                    
                    return "SUCCESS";
                } else {
                    $.writeln("Failed to import media");
                    return "FAILED";
                }
                
            } catch (error) {
                $.writeln("Error: " + error.message);
                return "ERROR";
            }
        `;
        
        return {
            script: extendScript,
            projectPath: projectPath,
            projectName: projectName
        };
    }

    /**
     * Test project creation and media import
     */
    async testProjectCreation() {
        console.log('🏗️ Testing project creation and media import...');
        
        try {
            // Create test video
            const testVideoPath = await this.createTestVideo();
            
            // Create ExtendScript
            const { script, projectPath, projectName } = this.createProjectExtendScript(testVideoPath);
            
            // Write ExtendScript to file
            const scriptPath = path.join(__dirname, 'project-creation-test.jsx');
            fs.writeFileSync(scriptPath, script);
            
            // Execute ExtendScript
            const command = this.platform === 'darwin'
                ? `osascript -e 'tell application "Adobe Premiere Pro 2025" to activate' && sleep 2 && osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`
                : `"${this.premierePath}" -executeScript "${scriptPath}"`;
            
            return new Promise((resolve) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.log('❌ Project creation failed:', error.message);
                        this.testResults.errors.push(`Project creation failed: ${error.message}`);
                    } else {
                        console.log('✅ Project creation successful');
                        console.log('📝 Output:', stdout);
                        
                        // Check if project file was created
                        if (fs.existsSync(projectPath)) {
                            console.log('✅ Project file saved successfully');
                            this.testResults.projectCreated = true;
                        } else {
                            console.log('⚠️ Project file not found');
                        }
                    }
                    
                    // Clean up script file
                    try {
                        fs.unlinkSync(scriptPath);
                    } catch (cleanupError) {
                        console.log('⚠️ Could not clean up script file:', cleanupError.message);
                    }
                    
                    resolve();
                });
            });
            
        } catch (error) {
            console.log('❌ Test failed:', error.message);
            this.testResults.errors.push(`Test failed: ${error.message}`);
        }
    }

    /**
     * Test basic export functionality
     */
    async testExportFunctionality() {
        console.log('📤 Testing export functionality...');
        
        const exportScript = `
            // Edit.ai Export Test
            try {
                var app = Application.currentApplication();
                var project = app.project;
                
                if (project) {
                    var timeline = project.getTimeline(0);
                    
                    if (timeline) {
                        // Export settings
                        var exportPath = "${path.join(__dirname, '..', 'temp', 'test-export.mp4')}";
                        
                        // Export timeline
                        timeline.exportAsMediaDirect(exportPath, "Premiere Pro", "Match Source - High bitrate", "Match Source", false);
                        
                        $.writeln("Export successful");
                        return "SUCCESS";
                    } else {
                        $.writeln("No timeline found");
                        return "FAILED";
                    }
                } else {
                    $.writeln("No project found");
                    return "FAILED";
                }
                
            } catch (error) {
                $.writeln("Export error: " + error.message);
                return "ERROR";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'export-test.jsx');
        fs.writeFileSync(scriptPath, exportScript);
        
        return new Promise((resolve) => {
            const command = this.platform === 'darwin'
                ? `osascript -e 'tell application "Adobe Premiere Pro 2025" to activate' && sleep 2 && osascript -e 'tell application "Adobe Premiere Pro 2025" to do script "${scriptPath}"'`
                : `"${this.premierePath}" -executeScript "${scriptPath}"`;
            
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Export test failed:', error.message);
                    this.testResults.errors.push(`Export failed: ${error.message}`);
                } else {
                    console.log('✅ Export test successful');
                    console.log('📝 Output:', stdout);
                    
                    const exportPath = path.join(__dirname, '..', 'temp', 'test-export.mp4');
                    if (fs.existsSync(exportPath)) {
                        console.log('✅ Export file created successfully');
                        this.testResults.exportSuccessful = true;
                    }
                }
                
                // Clean up script file
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
        console.log('\n📊 Project Creation Test Results:');
        console.log('==================================');
        
        console.log(`✅ Project Created: ${this.testResults.projectCreated}`);
        console.log(`✅ Media Imported: ${this.testResults.mediaImported}`);
        console.log(`✅ Timeline Created: ${this.testResults.timelineCreated}`);
        console.log(`✅ Export Successful: ${this.testResults.exportSuccessful}`);
        
        if (this.testResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.testResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.testResults.projectCreated) {
            console.log('✅ Project creation is working!');
            console.log('🚀 Ready to implement style-based editing');
        } else {
            console.log('❌ Project creation needs refinement');
            console.log('🔧 Need to debug ExtendScript execution');
        }
    }

    /**
     * Run all tests
     */
    async runAllTests() {
        console.log('🎬 Edit.ai - Project Creation & Media Import Test');
        console.log('==================================================\n');
        
        try {
            // Test project creation
            await this.testProjectCreation();
            
            // Test export functionality
            await this.testExportFunctionality();
            
            // Generate report
            this.generateTestReport();
            
        } catch (error) {
            console.log('❌ Test execution failed:', error.message);
        }
    }
}

// Run tests if this script is executed directly
if (require.main === module) {
    const tester = new ProjectCreationTester();
    tester.runAllTests();
}

module.exports = ProjectCreationTester;
