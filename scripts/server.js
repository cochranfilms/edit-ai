#!/usr/bin/env node

/**
 * Edit.ai - Web Server
 * Serves the creator platform and handles file uploads
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

class EditAIServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.setupMiddleware();
        this.setupFileUpload();
        this.setupRoutes();
    }

    setupMiddleware() {
        // Enable CORS
        this.app.use(cors());
        
        // Parse JSON bodies
        this.app.use(express.json());
        
        // Parse URL-encoded bodies
        this.app.use(express.urlencoded({ extended: true }));
        
        // Serve static files
        this.app.use(express.static(path.join(__dirname, '..')));
        
        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    setupFileUpload() {
        // Configure multer for file uploads
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = path.join(__dirname, '..', 'temp', 'uploads');
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        });

        this.upload = multer({ 
            storage: storage,
            limits: {
                fileSize: 500 * 1024 * 1024, // 500MB limit
                files: 10 // Max 10 files
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes = ['.prproj', '.mp4', '.mov', '.avi', '.m4v', '.mkv'];
                const ext = path.extname(file.originalname).toLowerCase();
                if (allowedTypes.includes(ext)) {
                    cb(null, true);
                } else {
                    cb(new Error(`File type ${ext} not allowed`));
                }
            }
        });
    }

    setupRoutes() {
        // Home route
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'creator-platform-landing.html'));
        });

        // Creator upload form
        this.app.get('/upload', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'creators', 'creator-upload-form.html'));
        });

        // Style selector
        this.app.get('/style-selector', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'web-interface', 'style-selector.html'));
        });

        // API Routes
        this.setupAPIRoutes();
    }

    setupAPIRoutes() {
        // Health check
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });

        // Get available styles
        this.app.get('/api/styles', (req, res) => {
            const stylesDir = path.join(__dirname, '..', 'styles');
            const styles = [];
            
            if (fs.existsSync(stylesDir)) {
                const files = fs.readdirSync(stylesDir);
                files.forEach(file => {
                    if (file.endsWith('.json')) {
                        try {
                            const styleData = JSON.parse(fs.readFileSync(path.join(stylesDir, file), 'utf8'));
                            styles.push({
                                id: path.basename(file, '.json'),
                                ...styleData
                            });
                        } catch (error) {
                            console.error(`Error reading style file ${file}:`, error);
                        }
                    }
                });
            }
            
            res.json(styles);
        });

        // Handle creator uploads
        this.app.post('/api/creator-upload', this.upload.array('projectFiles', 10), (req, res) => {
            try {
                const formData = req.body;
                const files = req.files || [];
                
                // Validate required fields
                const requiredFields = ['fullName', 'email', 'experience', 'specialty', 'projectDescription'];
                for (const field of requiredFields) {
                    if (!formData[field]) {
                        return res.status(400).json({
                            error: `Missing required field: ${field}`
                        });
                    }
                }

                // Save creator data
                const creatorData = {
                    id: Date.now().toString(),
                    ...formData,
                    files: files.map(file => ({
                        originalName: file.originalname,
                        filename: file.filename,
                        path: file.path,
                        size: file.size
                    })),
                    submittedAt: new Date().toISOString(),
                    status: 'pending'
                };

                // Save to creators data file
                const creatorsDataPath = path.join(__dirname, '..', 'creators', 'creators-data.json');
                let creatorsData = { creators: [], totalSubmissions: 0, totalEarnings: 0 };
                
                if (fs.existsSync(creatorsDataPath)) {
                    creatorsData = JSON.parse(fs.readFileSync(creatorsDataPath, 'utf8'));
                }
                
                creatorsData.creators.push(creatorData);
                creatorsData.totalSubmissions++;
                creatorsData.lastUpdated = new Date().toISOString();
                
                fs.writeFileSync(creatorsDataPath, JSON.stringify(creatorsData, null, 2));

                console.log(`✅ Creator upload received: ${creatorData.fullName} - ${files.length} files`);

                res.json({
                    success: true,
                    message: 'Creator application submitted successfully',
                    creatorId: creatorData.id,
                    filesReceived: files.length
                });

            } catch (error) {
                console.error('Error processing creator upload:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: error.message
                });
            }
        });

        // Get creators data
        this.app.get('/api/creators', (req, res) => {
            const creatorsDataPath = path.join(__dirname, '..', 'creators', 'creators-data.json');
            
            if (fs.existsSync(creatorsDataPath)) {
                const creatorsData = JSON.parse(fs.readFileSync(creatorsDataPath, 'utf8'));
                res.json(creatorsData);
            } else {
                res.json({ creators: [], totalSubmissions: 0, totalEarnings: 0 });
            }
        });

        // Start editing process
        this.app.post('/api/start-editing', (req, res) => {
            const { style, mediaFolder, outputPath } = req.body;
            
            if (!style || !mediaFolder || !outputPath) {
                return res.status(400).json({
                    error: 'Missing required parameters: style, mediaFolder, outputPath'
                });
            }

            // Start the editing process
            const { PremiereProBridge } = require('./bridge-controller');
            const bridge = new PremiereProBridge();
            
            bridge.startEditing({
                style,
                mediaFolder,
                outputPath
            }, (progress) => {
                console.log('Editing progress:', progress);
            }).then(result => {
                res.json({
                    success: true,
                    message: 'Editing process started',
                    result
                });
            }).catch(error => {
                res.status(500).json({
                    error: 'Failed to start editing process',
                    message: error.message
                });
            });
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log('🎬 Edit.ai Server Started');
            console.log('========================');
            console.log(`🌐 Server running on: http://localhost:${this.port}`);
            console.log(`📁 Creator Platform: http://localhost:${this.port}/upload`);
            console.log(`🎨 Style Selector: http://localhost:${this.port}/style-selector`);
            console.log(`🔧 API Health: http://localhost:${this.port}/api/health`);
            console.log('\n🚀 Ready to receive creator submissions!');
        });
    }
}

// Start server if this script is executed directly
if (require.main === module) {
    const server = new EditAIServer();
    server.start();
}

module.exports = EditAIServer;
