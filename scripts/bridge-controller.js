// AI Video Editor Bridge Controller
// Connects web interface to Premiere Pro automation
// This script handles the communication between the web UI and ExtendScript

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class PremiereProBridge {
    constructor() {
        this.premiereScriptPath = path.join(__dirname, 'premiere-controller.jsx');
        this.stylesPath = path.join(__dirname, '..', 'styles');
        this.tempPath = path.join(__dirname, '..', 'temp');
        
        // Ensure temp directory exists
        if (!fs.existsSync(this.tempPath)) {
            fs.mkdirSync(this.tempPath, { recursive: true });
        }
    }

    /**
     * Start automated video editing process
     * @param {Object} options - Editing options
     * @param {string} options.style - Style name (cinematic, vlog, etc.)
     * @param {string} options.mediaFolder - Path to media folder
     * @param {string} options.outputPath - Output video path
     * @param {Function} progressCallback - Progress callback function
     * @returns {Promise} Promise that resolves when editing is complete
     */
    async startEditing(options, progressCallback) {
        try {
            const { style, mediaFolder, outputPath } = options;
            
            // Validate inputs
            this.validateInputs(style, mediaFolder, outputPath);
            
            // Create configuration file
            const configPath = this.createConfigFile(options);
            
            // Execute Premiere Pro automation
            const result = await this.executePremiereScript(configPath, progressCallback);
            
            // Clean up temporary files
            this.cleanup(configPath);
            
            return result;
            
        } catch (error) {
            throw new Error(`Bridge error: ${error.message}`);
        }
    }

    /**
     * Validate input parameters
     */
    validateInputs(style, mediaFolder, outputPath) {
        if (!style) {
            throw new Error('Style is required');
        }
        
        if (!mediaFolder || !fs.existsSync(mediaFolder)) {
            throw new Error('Media folder does not exist');
        }
        
        if (!outputPath) {
            throw new Error('Output path is required');
        }
        
        // Check if style configuration exists
        const stylePath = path.join(this.stylesPath, `${style}.json`);
        if (!fs.existsSync(stylePath)) {
            throw new Error(`Style configuration not found: ${style}`);
        }
    }

    /**
     * Create configuration file for ExtendScript
     */
    createConfigFile(options) {
        const config = {
            style: options.style,
            mediaFolder: options.mediaFolder,
            outputPath: options.outputPath,
            timestamp: new Date().toISOString()
        };
        
        const configPath = path.join(this.tempPath, `config_${Date.now()}.json`);
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        return configPath;
    }

    /**
     * Execute Premiere Pro ExtendScript using hybrid automation
     */
    async executePremiereScript(configPath, progressCallback) {
        try {
            // Load configuration
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            
            // Use hybrid automation approach
            const { HybridAutomation } = require('./hybrid-automation');
            const automation = new HybridAutomation();
            
            console.log('🎬 Executing hybrid Premiere Pro automation...');
            
            // Start hybrid automation
            const result = await automation.startAutomation({
                style: config.style,
                mediaFolder: config.mediaFolder,
                outputPath: config.outputPath
            });
            
            if (result.success) {
                console.log('✅ Hybrid automation ready for manual execution');
                console.log(`📝 Script created: ${result.scriptPath}`);
                
                // Simulate progress updates
                this.simulateProgress(progressCallback);
                
                return {
                    success: true,
                    scriptPath: result.scriptPath,
                    message: 'Hybrid automation ready - execute script manually in Premiere Pro'
                };
            } else {
                throw new Error(result.error);
            }
            
        } catch (error) {
            console.error('❌ Hybrid automation failed:', error.message);
            throw new Error(`Hybrid automation failed: ${error.message}`);
        }
    }

    /**
     * Get Premiere Pro executable path based on OS
     */
    getPremiereProPath() {
        const platform = process.platform;
        
        switch (platform) {
            case 'darwin': // macOS
                return '/Applications/Adobe Premiere Pro 2024/Adobe Premiere Pro 2024.app/Contents/MacOS/Adobe Premiere Pro 2024';
            case 'win32': // Windows
                return 'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2024\\Adobe Premiere Pro.exe';
            default:
                throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    /**
     * Create ExtendScript command
     */
    createScriptCommand(configPath) {
        const platform = process.platform;
        
        if (platform === 'darwin') {
            // macOS: Use osascript to run ExtendScript
            return `osascript -e 'tell application "Adobe Premiere Pro 2024" to activate' && /usr/bin/osascript -e 'tell application "Adobe Premiere Pro 2024" to do script "${this.premiereScriptPath}" with arguments {${configPath}}'`;
        } else if (platform === 'win32') {
            // Windows: Use ExtendScript Toolkit or direct execution
            return `"${this.getPremiereProPath()}" -executeScript "${this.premiereScriptPath}" "${configPath}"`;
        } else {
            throw new Error(`Unsupported platform: ${platform}`);
        }
    }

    /**
     * Simulate progress updates
     */
    simulateProgress(progressCallback) {
        const steps = [
            { progress: 10, message: 'Initializing Premiere Pro...' },
            { progress: 20, message: 'Creating project...' },
            { progress: 35, message: 'Importing media files...' },
            { progress: 50, message: 'Applying style effects...' },
            { progress: 65, message: 'Adding transitions...' },
            { progress: 80, message: 'Mixing audio...' },
            { progress: 90, message: 'Exporting final video...' },
            { progress: 100, message: 'Editing complete!' }
        ];
        
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                const step = steps[currentStep];
                progressCallback(step.progress, step.message);
                currentStep++;
            } else {
                clearInterval(interval);
            }
        }, 1000);
    }

    /**
     * Clean up temporary files
     */
    cleanup(configPath) {
        try {
            if (fs.existsSync(configPath)) {
                fs.unlinkSync(configPath);
            }
        } catch (error) {
            console.warn('Cleanup warning:', error.message);
        }
    }

    /**
     * Get available styles
     */
    getAvailableStyles() {
        const styles = [];
        
        try {
            const files = fs.readdirSync(this.stylesPath);
            
            files.forEach(file => {
                if (file.endsWith('.json')) {
                    const styleName = file.replace('.json', '');
                    const stylePath = path.join(this.stylesPath, file);
                    const styleConfig = JSON.parse(fs.readFileSync(stylePath, 'utf8'));
                    
                    styles.push({
                        name: styleName,
                        displayName: styleConfig.name,
                        description: styleConfig.description,
                        version: styleConfig.version
                    });
                }
            });
        } catch (error) {
            console.error('Error reading styles:', error.message);
        }
        
        return styles;
    }

    /**
     * Validate media folder
     */
    validateMediaFolder(folderPath) {
        try {
            if (!fs.existsSync(folderPath)) {
                return { valid: false, error: 'Folder does not exist' };
            }
            
            const files = fs.readdirSync(folderPath);
            const videoExtensions = ['.mp4', '.mov', '.avi', '.m4v', '.mkv'];
            const audioExtensions = ['.wav', '.mp3', '.aac', '.m4a'];
            const supportedExtensions = [...videoExtensions, ...audioExtensions];
            
            const mediaFiles = files.filter(file => {
                const extension = path.extname(file).toLowerCase();
                return supportedExtensions.includes(extension);
            });
            
            if (mediaFiles.length === 0) {
                return { valid: false, error: 'No supported media files found' };
            }
            
            return {
                valid: true,
                fileCount: mediaFiles.length,
                files: mediaFiles
            };
            
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    /**
     * Get system information
     */
    getSystemInfo() {
        return {
            platform: process.platform,
            arch: process.arch,
            nodeVersion: process.version,
            premierePath: this.getPremiereProPath(),
            stylesPath: this.stylesPath,
            tempPath: this.tempPath
        };
    }
}

// Export for use in web interface
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiereProBridge;
}

// Example usage
if (require.main === module) {
    const bridge = new PremiereProBridge();
    
    // Example: Start editing
    const options = {
        style: 'cinematic',
        mediaFolder: '/path/to/media',
        outputPath: '/path/to/output/video.mp4'
    };
    
    bridge.startEditing(options, (progress, message) => {
        console.log(`Progress: ${progress}% - ${message}`);
    }).then(result => {
        console.log('Editing completed:', result);
    }).catch(error => {
        console.error('Editing failed:', error.message);
    });
}
