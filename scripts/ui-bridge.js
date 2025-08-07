#!/usr/bin/env node

/**
 * Edit.ai - UI Bridge
 * Connects web interface with multi-version processor
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

class UIBridge {
    constructor() {
        this.app = express();
        this.port = 3000;
        this.uploadDir = path.join(__dirname, '..', 'temp', 'uploads');
        this.exportsDir = path.join(__dirname, '..', 'temp', 'exports');
        
        this.setupDirectories();
        this.setupMiddleware();
        this.setupRoutes();
    }

    setupDirectories() {
        [this.uploadDir, this.exportsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    setupMiddleware() {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '..', 'web-interface')));
        
        // Configure multer for file uploads
        this.upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, this.uploadDir);
                },
                filename: (req, file, cb) => {
                    const uniqueName = Date.now() + '-' + file.originalname;
                    cb(null, uniqueName);
                }
            }),
            fileFilter: (req, file, cb) => {
                if (file.mimetype.startsWith('video/')) {
                    cb(null, true);
                } else {
                    cb(new Error('Only video files are allowed'), false);
                }
            },
            limits: {
                fileSize: 500 * 1024 * 1024 // 500MB limit
            }
        });
    }

    setupRoutes() {
        // Serve the main UI
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'web-interface', 'multi-version-ui.html'));
        });

        // Upload video file
        this.app.post('/upload', this.upload.single('video'), (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const fileInfo = {
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    size: req.file.size,
                    path: req.file.path
                };

                console.log('📁 File uploaded:', fileInfo);
                res.json({ success: true, file: fileInfo });
            } catch (error) {
                console.error('❌ Upload error:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Process video with selected styles
        this.app.post('/process', async (req, res) => {
            try {
                const { filename, styles } = req.body;
                
                if (!filename || !styles || styles.length === 0) {
                    return res.status(400).json({ error: 'Missing filename or styles' });
                }

                const filePath = path.join(this.uploadDir, filename);
                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({ error: 'File not found' });
                }

                console.log('🎬 Processing video:', filename);
                console.log('🎨 Selected styles:', styles);

                // Start processing in background
                const processingResult = await this.processVideo(filePath, styles);
                
                res.json({
                    success: true,
                    message: 'Processing started',
                    jobId: processingResult.jobId,
                    estimatedTime: processingResult.estimatedTime
                });

            } catch (error) {
                console.error('❌ Processing error:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Get processing status
        this.app.get('/status/:jobId', (req, res) => {
            const { jobId } = req.params;
            
            // In a real implementation, you'd check the actual job status
            // For now, we'll simulate status updates
            const status = this.getJobStatus(jobId);
            res.json(status);
        });

        // Get processing results
        this.app.get('/results/:jobId', (req, res) => {
            const { jobId } = req.params;
            
            try {
                const results = this.getJobResults(jobId);
                res.json(results);
            } catch (error) {
                res.status(404).json({ error: 'Results not found' });
            }
        });

        // Download processed video
        this.app.get('/download/:filename', (req, res) => {
            const { filename } = req.params;
            const filePath = path.join(this.exportsDir, filename);
            
            if (fs.existsSync(filePath)) {
                res.download(filePath);
            } else {
                res.status(404).json({ error: 'File not found' });
            }
        });

        // Get available styles
        this.app.get('/styles', (req, res) => {
            const styles = {
                wedding: {
                    name: 'Wedding Cinematic',
                    description: 'Emotional, romantic editing with warm colors and smooth transitions',
                    settings: {
                        pacing: 'emotional',
                        transitions: ['cross_dissolve', 'fade_to_black'],
                        colorGrading: 'warm_cinematic',
                        audioMixing: 'romantic_music_heavy'
                    }
                },
                musicVideo: {
                    name: 'Music Video Dynamic',
                    description: 'Fast-paced, rhythmic editing with vibrant colors and beat-synced cuts',
                    settings: {
                        pacing: 'fast_rhythmic',
                        transitions: ['cut', 'flash'],
                        colorGrading: 'vibrant_dynamic',
                        audioMixing: 'music_synced'
                    }
                },
                corporate: {
                    name: 'Corporate Professional',
                    description: 'Clean, professional editing with clear audio and neutral colors',
                    settings: {
                        pacing: 'professional_steady',
                        transitions: ['cut', 'cross_dissolve'],
                        colorGrading: 'clean_neutral',
                        audioMixing: 'voice_clear'
                    }
                },
                educational: {
                    name: 'Educational Clear',
                    description: 'Clear, instructional editing with natural colors and explanatory structure',
                    settings: {
                        pacing: 'clear_explanatory',
                        transitions: ['cut', 'simple_dissolve'],
                        colorGrading: 'natural_clear',
                        audioMixing: 'voice_primary'
                    }
                }
            };
            
            res.json(styles);
        });
    }

    async processVideo(filePath, styles) {
        return new Promise((resolve, reject) => {
            const jobId = Date.now().toString();
            const estimatedTime = styles.length * 30; // 30 seconds per style
            
            console.log(`🔧 Starting job ${jobId} with ${styles.length} styles`);
            
            // Import the multi-version processor
            const MultiVersionProcessor = require('./multi-version-processor');
            const processor = new MultiVersionProcessor();
            
            // Process the video
            processor.processMultiVersions(filePath, styles)
                .then(() => {
                    console.log(`✅ Job ${jobId} completed successfully`);
                    resolve({
                        jobId,
                        estimatedTime,
                        status: 'completed'
                    });
                })
                .catch(error => {
                    console.error(`❌ Job ${jobId} failed:`, error);
                    reject(error);
                });
        });
    }

    getJobStatus(jobId) {
        // Simulate status updates
        const statuses = ['processing', 'completed', 'failed'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        return {
            jobId,
            status: randomStatus,
            progress: randomStatus === 'processing' ? Math.floor(Math.random() * 100) : 100,
            message: `Job ${jobId} is ${randomStatus}`
        };
    }

    getJobResults(jobId) {
        // Simulate results
        const results = [
            {
                name: 'Wedding_Cinematic.mp4',
                size: '15.2 MB',
                style: 'Wedding Cinematic',
                downloadUrl: `/download/Wedding_Cinematic.mp4`
            },
            {
                name: 'Music_Video_Dynamic.mp4',
                size: '18.7 MB',
                style: 'Music Video Dynamic',
                downloadUrl: `/download/Music_Video_Dynamic.mp4`
            },
            {
                name: 'Corporate_Professional.mp4',
                size: '12.9 MB',
                style: 'Corporate Professional',
                downloadUrl: `/download/Corporate_Professional.mp4`
            }
        ];
        
        return {
            jobId,
            status: 'completed',
            results
        };
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('🎬 Edit.ai UI Bridge Server');
            console.log('==========================');
            console.log(`🌐 Server running on http://localhost:${this.port}`);
            console.log(`📁 Upload directory: ${this.uploadDir}`);
            console.log(`📂 Export directory: ${this.exportsDir}`);
            console.log('🚀 Ready to process videos!');
        });
    }
}

// Start the server if this script is executed directly
if (require.main === module) {
    const bridge = new UIBridge();
    bridge.start();
}

module.exports = UIBridge;
