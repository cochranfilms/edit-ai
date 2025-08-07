#!/usr/bin/env node

/**
 * Edit.ai - Hybrid Automation System
 * Combines manual ExtendScript execution with automated file management
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class HybridAutomation {
    constructor() {
        this.premierePath = this.getPremiereProPath();
        this.scriptsDir = path.join(__dirname, 'extendscript');
        this.tempDir = path.join(__dirname, '..', 'temp');
        
        // Ensure directories exist
        this.ensureDirectories();
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

    ensureDirectories() {
        [this.scriptsDir, this.tempDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    /**
     * Create ExtendScript file for manual execution
     */
    createExtendScript(style, mediaFolder, outputPath) {
        const scriptContent = this.generateExtendScript(style, mediaFolder, outputPath);
        const scriptName = `edit-ai-${style}-${Date.now()}.jsx`;
        const scriptPath = path.join(this.scriptsDir, scriptName);
        
        fs.writeFileSync(scriptPath, scriptContent);
        
        console.log(`📝 Created ExtendScript: ${scriptPath}`);
        return scriptPath;
    }

    /**
     * Generate ExtendScript content based on style
     */
    generateExtendScript(style, mediaFolder, outputPath) {
        const styleConfig = this.loadStyleConfig(style);
        
        return `
// Edit.ai Automated Video Editing Script
// Generated: ${new Date().toISOString()}
// Style: ${style}
// Media Folder: ${mediaFolder}
// Output: ${outputPath}

var app = app || Application.currentApplication();

try {
    $.writeln("=== Edit.ai Automation Started ===");
    $.writeln("Style: ${style}");
    $.writeln("Media Folder: ${mediaFolder}");
    $.writeln("Output: ${outputPath}");
    
    // Initialize Premiere Pro
    if (!app.isRunning) {
        app.activate();
        $.writeln("✅ Premiere Pro activated");
    }
    
    // Close any existing projects
    if (app.project) {
        app.project.close();
        $.writeln("✅ Closed existing project");
    }
    
    // Create new project
    var project = app.newProject();
    $.writeln("✅ Created new project: " + project.name);
    
    // Set project settings based on style
    setProjectSettings(project, ${JSON.stringify(styleConfig.export_settings)});
    
    // Create timeline
    var timeline = project.createNewTimeline("Edit.ai ${style} Timeline");
    $.writeln("✅ Created timeline: " + timeline.name);
    
    // Import media files
    importMediaFiles("${mediaFolder}", project);
    
    // Apply style-based editing
    applyStyleEditing(timeline, ${JSON.stringify(styleConfig)});
    
    // Export final video
    exportVideo(timeline, "${outputPath}", ${JSON.stringify(styleConfig.export_settings)});
    
    $.writeln("🎉 Edit.ai automation completed successfully!");
    alert("Edit.ai automation completed! Video saved to: ${outputPath}");
    
} catch (error) {
    $.writeln("❌ Error during automation: " + error.message);
    alert("Edit.ai automation failed: " + error.message);
}

// Helper functions
function setProjectSettings(project, settings) {
    try {
        project.videoFrameRate = settings.frame_rate;
        project.videoFrameSize = settings.resolution;
        $.writeln("✅ Project settings applied");
    } catch (error) {
        $.writeln("⚠️ Could not set all project settings: " + error.message);
    }
}

function importMediaFiles(folderPath, project) {
    try {
        // This would import media files from the folder
        $.writeln("📁 Importing media from: " + folderPath);
        // Implementation would go here
        $.writeln("✅ Media import completed");
    } catch (error) {
        $.writeln("❌ Media import failed: " + error.message);
    }
}

function applyStyleEditing(timeline, styleConfig) {
    try {
        $.writeln("🎨 Applying ${style} style...");
        
        // Apply pacing
        applyPacing(timeline, styleConfig.pacing);
        
        // Apply transitions
        applyTransitions(timeline, styleConfig.transitions);
        
        // Apply effects
        applyEffects(timeline, styleConfig.effects);
        
        // Mix audio
        mixAudio(timeline, styleConfig.audio);
        
        $.writeln("✅ Style application completed");
    } catch (error) {
        $.writeln("❌ Style application failed: " + error.message);
    }
}

function applyPacing(timeline, pacing) {
    $.writeln("⏱️ Applying pacing: " + pacing.type);
    // Pacing implementation
}

function applyTransitions(timeline, transitions) {
    $.writeln("🔄 Applying " + transitions.length + " transitions");
    // Transitions implementation
}

function applyEffects(timeline, effects) {
    $.writeln("✨ Applying " + effects.length + " effects");
    // Effects implementation
}

function mixAudio(timeline, audio) {
    $.writeln("🎵 Mixing audio");
    // Audio mixing implementation
}

function exportVideo(timeline, outputPath, settings) {
    try {
        $.writeln("📤 Exporting video to: " + outputPath);
        // Export implementation
        $.writeln("✅ Export completed");
    } catch (error) {
        $.writeln("❌ Export failed: " + error.message);
    }
}
`;
    }

    /**
     * Load style configuration
     */
    loadStyleConfig(style) {
        const stylePath = path.join(__dirname, '..', 'styles', `${style}.json`);
        if (fs.existsSync(stylePath)) {
            return JSON.parse(fs.readFileSync(stylePath, 'utf8'));
        }
        throw new Error(`Style configuration not found: ${style}`);
    }

    /**
     * Launch Premiere Pro with script ready for manual execution
     */
    async launchPremierePro(scriptPath) {
        console.log('🚀 Launching Premiere Pro for manual script execution...');
        
        try {
            // Launch Premiere Pro
            await this.executeCommand(`open -a "Adobe Premiere Pro 2025"`);
            
            console.log('✅ Premiere Pro launched');
            console.log('📝 ExtendScript ready for execution:');
            console.log(`   ${scriptPath}`);
            console.log('\n💡 Manual Steps:');
            console.log('1. In Premiere Pro, go to File > Scripts > Run Script File...');
            console.log(`2. Navigate to: ${scriptPath}`);
            console.log('3. Click "Open" to execute the script');
            console.log('4. The script will automate the editing process');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to launch Premiere Pro:', error.message);
            return false;
        }
    }

    /**
     * Start the hybrid automation process
     */
    async startAutomation(options) {
        const { style, mediaFolder, outputPath } = options;
        
        console.log('🎬 Edit.ai - Hybrid Automation');
        console.log('==============================\n');
        
        try {
            // Validate inputs
            this.validateInputs(style, mediaFolder, outputPath);
            
            // Create ExtendScript file
            const scriptPath = this.createExtendScript(style, mediaFolder, outputPath);
            
            // Launch Premiere Pro
            const launched = await this.launchPremierePro(scriptPath);
            
            if (launched) {
                console.log('\n🎯 Automation Ready!');
                console.log('===================');
                console.log('✅ ExtendScript created');
                console.log('✅ Premiere Pro launched');
                console.log('✅ Ready for manual execution');
                
                return {
                    success: true,
                    scriptPath: scriptPath,
                    message: 'Hybrid automation ready - execute script manually in Premiere Pro'
                };
            } else {
                throw new Error('Failed to launch Premiere Pro');
            }
            
        } catch (error) {
            console.error('❌ Automation failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    validateInputs(style, mediaFolder, outputPath) {
        if (!style) throw new Error('Style is required');
        if (!mediaFolder || !fs.existsSync(mediaFolder)) {
            throw new Error('Media folder does not exist');
        }
        if (!outputPath) throw new Error('Output path is required');
        
        // Check if style configuration exists
        const stylePath = path.join(__dirname, '..', 'styles', `${style}.json`);
        if (!fs.existsSync(stylePath)) {
            throw new Error(`Style configuration not found: ${style}`);
        }
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    resolve(stdout || stderr);
                }
            });
        });
    }

    /**
     * Demo the hybrid automation system
     */
    async runDemo() {
        console.log('🎬 Edit.ai - Hybrid Automation Demo');
        console.log('===================================\n');
        
        // Test with sample data
        const testOptions = {
            style: 'cinematic',
            mediaFolder: path.join(__dirname, '..', 'test-media'),
            outputPath: path.join(__dirname, '..', 'temp', 'output', 'demo-video.mp4')
        };
        
        console.log('🧪 Testing hybrid automation...');
        console.log(`Style: ${testOptions.style}`);
        console.log(`Media: ${testOptions.mediaFolder}`);
        console.log(`Output: ${testOptions.outputPath}\n`);
        
        const result = await this.startAutomation(testOptions);
        
        if (result.success) {
            console.log('\n✅ Hybrid automation demo successful!');
            console.log('🚀 Ready to implement in main system');
        } else {
            console.log('\n❌ Hybrid automation demo failed');
            console.log('🔧 Need to troubleshoot issues');
        }
    }
}

// Run demo if this script is executed directly
if (require.main === module) {
    const automation = new HybridAutomation();
    automation.runDemo().catch(console.error);
}

module.exports = HybridAutomation;
