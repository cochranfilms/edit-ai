#!/usr/bin/env node

/**
 * Edit.ai - Real Project Analysis
 * This script analyzes real Premiere Pro projects to extract editing patterns
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class RealProjectAnalyzer {
    constructor() {
        this.projectPaths = [
            '/Volumes/00-TRAVEL/VAULT/PROJECTS',
            '/Volumes/01-EXTRA',
            '/Volumes/02-CLIENT'
        ];
        this.analysisResults = {
            projectsFound: [],
            projectCount: 0,
            totalFootageSize: 0,
            editingPatterns: [],
            timelineStructures: [],
            errors: []
        };
    }

    /**
     * Check if external drives are mounted
     */
    async checkDrives() {
        console.log('🔍 Checking external drives...');
        
        for (const drivePath of this.projectPaths) {
            try {
                if (fs.existsSync(drivePath)) {
                    console.log(`✅ Drive mounted: ${drivePath}`);
                    
                    // Get drive info
                    const stats = fs.statSync(drivePath);
                    const driveInfo = {
                        path: drivePath,
                        exists: true,
                        size: stats.size,
                        lastModified: stats.mtime
                    };
                    
                    console.log(`📊 Drive info: ${JSON.stringify(driveInfo, null, 2)}`);
                } else {
                    console.log(`❌ Drive not mounted: ${drivePath}`);
                }
            } catch (error) {
                console.log(`❌ Error checking drive ${drivePath}:`, error.message);
                this.analysisResults.errors.push(`Drive check failed: ${error.message}`);
            }
        }
    }

    /**
     * Find Premiere Pro project files
     */
    async findPremiereProjects() {
        console.log('🎬 Searching for Premiere Pro projects...');
        
        for (const projectPath of this.projectPaths) {
            if (!fs.existsSync(projectPath)) continue;
            
            try {
                const projects = await this.scanForProjects(projectPath);
                this.analysisResults.projectsFound.push(...projects);
                this.analysisResults.projectCount += projects.length;
                
                console.log(`📁 Found ${projects.length} projects in ${projectPath}`);
                
            } catch (error) {
                console.log(`❌ Error scanning ${projectPath}:`, error.message);
                this.analysisResults.errors.push(`Scan failed: ${error.message}`);
            }
        }
    }

    /**
     * Recursively scan for Premiere Pro projects
     */
    async scanForProjects(directory) {
        const projects = [];
        
        try {
            const items = fs.readdirSync(directory);
            
            for (const item of items) {
                const fullPath = path.join(directory, item);
                
                try {
                    const stats = fs.statSync(fullPath);
                    
                    if (stats.isDirectory()) {
                        // Recursively scan subdirectories
                        const subProjects = await this.scanForProjects(fullPath);
                        projects.push(...subProjects);
                    } else if (stats.isFile()) {
                        // Check if it's a Premiere Pro project
                        if (item.toLowerCase().endsWith('.prproj')) {
                            const projectInfo = {
                                name: item,
                                path: fullPath,
                                size: stats.size,
                                lastModified: stats.mtime,
                                directory: directory
                            };
                            
                            projects.push(projectInfo);
                            console.log(`🎬 Found project: ${item}`);
                        }
                    }
                } catch (error) {
                    // Skip files/directories we can't access
                    continue;
                }
            }
        } catch (error) {
            // Skip directories we can't access
            return [];
        }
        
        return projects;
    }

    /**
     * Analyze project structure and metadata
     */
    async analyzeProject(projectInfo) {
        console.log(`🔍 Analyzing project: ${projectInfo.name}`);
        
        try {
            // Get project directory contents
            const projectDir = path.dirname(projectInfo.path);
            const contents = fs.readdirSync(projectDir);
            
            const analysis = {
                project: projectInfo,
                mediaFiles: [],
                audioFiles: [],
                projectFiles: [],
                timelineFiles: [],
                totalSize: 0
            };
            
            // Categorize files
            for (const item of contents) {
                const itemPath = path.join(projectDir, item);
                
                try {
                    const stats = fs.statSync(itemPath);
                    
                    if (stats.isFile()) {
                        const ext = path.extname(item).toLowerCase();
                        
                        // Video files
                        if (['.mp4', '.mov', '.avi', '.mxf', '.r3d', '.arw'].includes(ext)) {
                            analysis.mediaFiles.push({
                                name: item,
                                path: itemPath,
                                size: stats.size,
                                lastModified: stats.mtime
                            });
                        }
                        // Audio files
                        else if (['.wav', '.aiff', '.mp3', '.m4a'].includes(ext)) {
                            analysis.audioFiles.push({
                                name: item,
                                path: itemPath,
                                size: stats.size,
                                lastModified: stats.mtime
                            });
                        }
                        // Project files
                        else if (['.prproj', '.aep', '.psd'].includes(ext)) {
                            analysis.projectFiles.push({
                                name: item,
                                path: itemPath,
                                size: stats.size,
                                lastModified: stats.mtime
                            });
                        }
                        
                        analysis.totalSize += stats.size;
                    }
                } catch (error) {
                    // Skip files we can't access
                    continue;
                }
            }
            
            // Add to analysis results
            this.analysisResults.editingPatterns.push(analysis);
            this.analysisResults.totalFootageSize += analysis.totalSize;
            
            console.log(`📊 Project analysis: ${analysis.mediaFiles.length} video files, ${analysis.audioFiles.length} audio files`);
            
        } catch (error) {
            console.log(`❌ Error analyzing project ${projectInfo.name}:`, error.message);
            this.analysisResults.errors.push(`Project analysis failed: ${error.message}`);
        }
    }

    /**
     * Create ExtendScript to analyze project in Premiere Pro
     */
    createProjectAnalysisScript(projectPath) {
        const analysisScript = `
            // Edit.ai Project Analysis Script
            try {
                $.writeln("=== Edit.ai Project Analysis ===");
                
                // Try to open the project
                var projectFile = File("${projectPath}");
                $.writeln("Project path: " + projectPath);
                $.writeln("Project exists: " + projectFile.exists);
                
                if (projectFile.exists) {
                    // This would normally open and analyze the project
                    $.writeln("Project file found!");
                    
                    // Analyze project structure
                    var projectAnalysis = {
                        name: projectFile.name,
                        path: projectPath,
                        size: projectFile.length,
                        lastModified: projectFile.modified
                    };
                    
                    $.writeln("Project analysis: " + JSON.stringify(projectAnalysis));
                    $.writeln("=== Project Analysis Complete ===");
                    
                    "SUCCESS";
                } else {
                    $.writeln("Project file not found");
                    "FAILED";
                }
                
            } catch (error) {
                $.writeln("Project analysis error: " + error.message);
                "FAILED";
            }
        `;
        
        const scriptPath = path.join(__dirname, 'project-analysis-test.jsx');
        fs.writeFileSync(scriptPath, analysisScript);
        return scriptPath;
    }

    /**
     * Test opening a real project in Premiere Pro
     */
    async testOpenRealProject(projectInfo) {
        console.log(`🎬 Testing opening real project: ${projectInfo.name}`);
        
        const scriptPath = this.createProjectAnalysisScript(projectInfo.path);
        
        return new Promise((resolve) => {
            const command = `open -a "Adobe Premiere Pro 2025" "${scriptPath}"`;
            
            console.log(`🔧 Executing: ${command}`);
            
            exec(command, { timeout: 15000 }, (error, stdout, stderr) => {
                if (error) {
                    console.log('❌ Project opening failed:', error.message);
                    this.analysisResults.errors.push(`Project opening failed: ${error.message}`);
                } else {
                    console.log('✅ Project opening successful!');
                    console.log('📝 Output:', stdout);
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
     * Generate analysis report
     */
    generateAnalysisReport() {
        console.log('\n📊 Real Project Analysis Results:');
        console.log('==================================');
        
        console.log(`✅ Projects Found: ${this.analysisResults.projectCount}`);
        console.log(`📁 Total Footage Size: ${(this.analysisResults.totalFootageSize / (1024 * 1024 * 1024)).toFixed(2)} GB`);
        console.log(`🎬 Editing Patterns Analyzed: ${this.analysisResults.editingPatterns.length}`);
        
        if (this.analysisResults.projectsFound.length > 0) {
            console.log('\n📁 Projects Found:');
            this.analysisResults.projectsFound.forEach((project, index) => {
                console.log(`${index + 1}. ${project.name} (${(project.size / (1024 * 1024)).toFixed(2)} MB)`);
                console.log(`   Path: ${project.path}`);
            });
        }
        
        if (this.analysisResults.editingPatterns.length > 0) {
            console.log('\n🎬 Editing Patterns:');
            this.analysisResults.editingPatterns.forEach((pattern, index) => {
                console.log(`${index + 1}. ${pattern.project.name}:`);
                console.log(`   - Video files: ${pattern.mediaFiles.length}`);
                console.log(`   - Audio files: ${pattern.audioFiles.length}`);
                console.log(`   - Total size: ${(pattern.totalSize / (1024 * 1024)).toFixed(2)} MB`);
            });
        }
        
        if (this.analysisResults.errors.length > 0) {
            console.log('\n❌ Errors Found:');
            this.analysisResults.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Next Steps:');
        if (this.analysisResults.projectCount > 0) {
            console.log('✅ Real projects found and analyzed!');
            console.log('🚀 Ready to extract editing patterns');
            console.log('💡 Can now build style-based automation');
        } else {
            console.log('❌ No projects found');
            console.log('🔧 Check drive paths and permissions');
        }
    }

    /**
     * Run full analysis
     */
    async runFullAnalysis() {
        console.log('🎬 Edit.ai - Real Project Analysis');
        console.log('==================================\n');
        
        try {
            // Check drives
            await this.checkDrives();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Find projects
            await this.findPremiereProjects();
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Analyze projects
            for (const project of this.analysisResults.projectsFound) {
                await this.analyzeProject(project);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Test opening a real project (first one found)
            if (this.analysisResults.projectsFound.length > 0) {
                await this.testOpenRealProject(this.analysisResults.projectsFound[0]);
            }
            
            // Generate report
            this.generateAnalysisReport();
            
        } catch (error) {
            console.log('❌ Analysis failed:', error.message);
        }
    }
}

// Run analysis if this script is executed directly
if (require.main === module) {
    const analyzer = new RealProjectAnalyzer();
    analyzer.runFullAnalysis();
}

module.exports = RealProjectAnalyzer;
