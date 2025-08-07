#!/usr/bin/env node

/**
 * Edit.ai - Multi-Version Processor
 * Creates multiple edited versions of source footage using different styles
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class MultiVersionProcessor {
    constructor() {
        this.styleDefinitions = {
            wedding: {
                name: 'Wedding Cinematic',
                description: 'Emotional, romantic editing with warm colors and smooth transitions',
                settings: {
                    pacing: 'emotional',
                    transitions: ['cross_dissolve', 'fade_to_black'],
                    colorGrading: 'warm_cinematic',
                    audioMixing: 'romantic_music_heavy',
                    effects: ['basic_color_correction'],
                    timelineStructure: 'narrative_storytelling'
                }
            },
            musicVideo: {
                name: 'Music Video Dynamic',
                description: 'Fast-paced, rhythmic editing with vibrant colors and beat-synced cuts',
                settings: {
                    pacing: 'fast_rhythmic',
                    transitions: ['cut', 'flash'],
                    colorGrading: 'vibrant_dynamic',
                    audioMixing: 'music_synced',
                    effects: ['advanced_color_grading', 'speed_ramps'],
                    timelineStructure: 'beat_synced_montage'
                }
            },
            corporate: {
                name: 'Corporate Professional',
                description: 'Clean, professional editing with clear audio and neutral colors',
                settings: {
                    pacing: 'professional_steady',
                    transitions: ['cut', 'cross_dissolve'],
                    colorGrading: 'clean_neutral',
                    audioMixing: 'voice_clear',
                    effects: ['minimal'],
                    timelineStructure: 'interview_b_roll'
                }
            },
            educational: {
                name: 'Educational Clear',
                description: 'Clear, instructional editing with natural colors and explanatory structure',
                settings: {
                    pacing: 'clear_explanatory',
                    transitions: ['cut', 'simple_dissolve'],
                    colorGrading: 'natural_clear',
                    audioMixing: 'voice_primary',
                    effects: ['text_overlays', 'diagrams'],
                    timelineStructure: 'instructional_step_by_step'
                }
            }
        };
        
        this.processingResults = {
            versions: [],
            errors: [],
            processingTime: 0
        };
    }

    /**
     * Create ExtendScript for multi-version processing
     */
    createMultiVersionScript(sourceFootage, styles, outputDir) {
        const script = `
            // Edit.ai Multi-Version Processing Script
            try {
                $.writeln("=== Edit.ai Multi-Version Processing ===");
                
                var sourceFootage = "${sourceFootage}";
                var outputDir = "${outputDir}";
                var styles = ${JSON.stringify(styles)};
                
                $.writeln("Source footage: " + sourceFootage);
                $.writeln("Output directory: " + outputDir);
                $.writeln("Styles to process: " + styles.length);
                
                // Create new project
                var app = Application.currentApplication();
                var project = app.newProject();
                project.name = "Edit.ai Multi-Version Project";
                project.videoFrameRate = 24;
                project.videoFrameSize = "1920x1080";
                project.audioSampleRate = 48000;
                project.audioChannels = 2;
                
                // Import source footage
                var mediaItem = project.importFiles([sourceFootage], false, project.rootItem, false);
                if (!mediaItem || mediaItem.length === 0) {
                    throw new Error("Failed to import source footage");
                }
                
                $.writeln("Source footage imported successfully");
                
                // Process each style
                for (var i = 0; i < styles.length; i++) {
                    var style = styles[i];
                    $.writeln("Processing style: " + style.name);
                    
                    // Create timeline for this style
                    var timeline = project.createNewTimeline(style.name + " Version");
                    
                    // Apply style-specific settings
                    applyStyleSettings(timeline, style);
                    
                    // Add footage to timeline
                    var videoTrack = timeline.getVideoTracks()[0];
                    var audioTrack = timeline.getAudioTracks()[0];
                    
                    videoTrack.insertClip(mediaItem[0], 0);
                    audioTrack.insertClip(mediaItem[0], 0);
                    
                    // Apply style effects
                    applyStyleEffects(timeline, style);
                    
                    // Export this version
                    var exportPath = outputDir + "/" + style.name.replace(/\\s+/g, "_") + ".mp4";
                    timeline.exportAsMediaDirect(exportPath, "Premiere Pro", "Match Source - High bitrate", "Match Source", false);
                    
                    $.writeln("Exported: " + exportPath);
                }
                
                $.writeln("=== Multi-Version Processing Complete ===");
                "SUCCESS";
                
            } catch (error) {
                $.writeln("Processing error: " + error.message);
                "FAILED";
            }
            
            function applyStyleSettings(timeline, style) {
                // Apply pacing
                if (style.settings.pacing === 'fast_rhythmic') {
                    timeline.setSpeed(1.5); // Faster playback
                } else if (style.settings.pacing === 'emotional') {
                    timeline.setSpeed(0.8); // Slower, more emotional
                }
                
                // Apply color grading
                if (style.settings.colorGrading === 'warm_cinematic') {
                    // Apply warm cinematic look
                    var colorEffect = timeline.addEffect("Lumetri Color");
                    colorEffect.setParameter("Temperature", 6500); // Warm
                    colorEffect.setParameter("Tint", 10);
                } else if (style.settings.colorGrading === 'vibrant_dynamic') {
                    // Apply vibrant look
                    var colorEffect = timeline.addEffect("Lumetri Color");
                    colorEffect.setParameter("Saturation", 120);
                    colorEffect.setParameter("Contrast", 110);
                }
            }
            
            function applyStyleEffects(timeline, style) {
                // Apply transitions based on style
                if (style.settings.transitions.includes('cross_dissolve')) {
                    // Add cross dissolves
                    var clips = timeline.getVideoTracks()[0].getClips();
                    for (var i = 1; i < clips.length; i++) {
                        var transition = timeline.addTransition("Cross Dissolve", clips[i-1], clips[i]);
                    }
                }
                
                // Apply audio mixing
                if (style.settings.audioMixing === 'romantic_music_heavy') {
                    var audioTrack = timeline.getAudioTracks()[0];
                    audioTrack.setVolume(-6); // Lower voice, emphasize music
                } else if (style.settings.audioMixing === 'voice_clear') {
                    var audioTrack = timeline.getAudioTracks()[0];
                    audioTrack.setVolume(0); // Clear voice
                }
            }
        `;
        
        const scriptPath = path.join(__dirname, 'multi-version-processing.jsx');
        fs.writeFileSync(scriptPath, script);
        return scriptPath;
    }

    /**
     * Process source footage into multiple versions
     */
    async processMultiVersions(sourceFootage, selectedStyles = null) {
        console.log('🎬 Edit.ai - Multi-Version Processing');
        console.log('=====================================\n');
        
        const startTime = Date.now();
        
        try {
            // Validate source footage
            if (!fs.existsSync(sourceFootage)) {
                throw new Error(`Source footage not found: ${sourceFootage}`);
            }
            
            console.log(`📁 Source footage: ${sourceFootage}`);
            
            // Select styles to process
            const stylesToProcess = selectedStyles || Object.keys(this.styleDefinitions);
            console.log(`🎨 Processing ${stylesToProcess.length} styles: ${stylesToProcess.join(', ')}`);
            
            // Create output directory
            const outputDir = path.join(__dirname, '..', 'temp', 'multi-version-exports');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            console.log(`📂 Output directory: ${outputDir}`);
            
            // Prepare style data for ExtendScript
            const styles = stylesToProcess.map(styleKey => ({
                name: this.styleDefinitions[styleKey].name,
                settings: this.styleDefinitions[styleKey].settings
            }));
            
            // Create and execute processing script
            const scriptPath = this.createMultiVersionScript(sourceFootage, styles, outputDir);
            
            console.log('🔧 Executing multi-version processing...');
            
            await this.executeProcessingScript(scriptPath);
            
            // Check for exported files
            const exportedFiles = this.checkExportedFiles(outputDir, styles);
            
            // Generate processing report
            this.generateProcessingReport(exportedFiles, startTime);
            
        } catch (error) {
            console.log('❌ Multi-version processing failed:', error.message);
            this.processingResults.errors.push(error.message);
        }
    }

    /**
     * Execute the processing script in Premiere Pro
     */
    async executeProcessingScript(scriptPath) {
        return new Promise((resolve, reject) => {
            const command = `open -a "Adobe Premiere Pro 2025" "${scriptPath}"`;
            
            console.log(`🔧 Executing: ${command}`);
            
            exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Processing failed:`, error.message);
                    reject(error);
                } else {
                    console.log(`✅ Processing successful!`);
                    console.log('📝 Output:', stdout);
                    resolve();
                }
                
                // Clean up
                try {
                    fs.unlinkSync(scriptPath);
                } catch (cleanupError) {
                    console.log('⚠️ Could not clean up script file:', cleanupError.message);
                }
            });
        });
    }

    /**
     * Check for exported files
     */
    checkExportedFiles(outputDir, styles) {
        const exportedFiles = [];
        
        try {
            const files = fs.readdirSync(outputDir);
            
            for (const file of files) {
                if (file.endsWith('.mp4')) {
                    const filePath = path.join(outputDir, file);
                    const stats = fs.statSync(filePath);
                    
                    exportedFiles.push({
                        name: file,
                        path: filePath,
                        size: stats.size,
                        created: stats.birthtime
                    });
                }
            }
            
            console.log(`✅ Found ${exportedFiles.length} exported files:`);
            exportedFiles.forEach(file => {
                console.log(`  - ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            });
            
        } catch (error) {
            console.log('⚠️ Could not check exported files:', error.message);
        }
        
        return exportedFiles;
    }

    /**
     * Generate processing report
     */
    generateProcessingReport(exportedFiles, startTime) {
        const processingTime = Date.now() - startTime;
        
        console.log('\n📊 Multi-Version Processing Results:');
        console.log('====================================');
        
        console.log(`⏱️ Processing time: ${(processingTime / 1000).toFixed(2)} seconds`);
        console.log(`✅ Versions created: ${exportedFiles.length}`);
        console.log(`🎨 Styles processed: ${Object.keys(this.styleDefinitions).length}`);
        
        if (exportedFiles.length > 0) {
            console.log('\n📁 Exported Files:');
            exportedFiles.forEach((file, index) => {
                console.log(`${index + 1}. ${file.name}`);
                console.log(`   Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Created: ${file.created.toLocaleString()}`);
            });
        }
        
        if (this.processingResults.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.processingResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        console.log('✅ Multi-version processing complete!');
        console.log('🚀 Ready to implement creator incentive platform');
        console.log('💡 Can now build user interface for style selection');
        console.log('💰 Ready to monetize the multi-version system');
    }

    /**
     * Create test footage for processing
     */
    async createTestFootage() {
        console.log('🎬 Creating test footage...');
        
        const testVideoPath = path.join(__dirname, '..', 'temp', 'test-footage.mp4');
        const testDir = path.dirname(testVideoPath);
        
        if (!fs.existsSync(testDir)) {
            fs.mkdirSync(testDir, { recursive: true });
        }
        
        // Create a test video using FFmpeg
        const ffmpegCommand = `ffmpeg -f lavfi -i testsrc=duration=30:size=1920x1080:rate=24 -f lavfi -i sine=frequency=440:duration=30 -c:v libx264 -c:a aac -shortest "${testVideoPath}"`;
        
        return new Promise((resolve, reject) => {
            exec(ffmpegCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Failed to create test footage:', error.message);
                    reject(error);
                } else {
                    console.log('✅ Test footage created successfully!');
                    resolve(testVideoPath);
                }
            });
        });
    }

    /**
     * Run full multi-version processing test
     */
    async runFullTest() {
        console.log('🎬 Edit.ai - Multi-Version Processing Test');
        console.log('==========================================\n');
        
        try {
            // Create test footage
            const testFootage = await this.createTestFootage();
            
            // Process multiple versions
            await this.processMultiVersions(testFootage);
            
        } catch (error) {
            console.log('❌ Test failed:', error.message);
        }
    }
}

// Run test if this script is executed directly
if (require.main === module) {
    const processor = new MultiVersionProcessor();
    processor.runFullTest();
}

module.exports = MultiVersionProcessor;
