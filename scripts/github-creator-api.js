#!/usr/bin/env node

/**
 * Edit.ai - GitHub Creator API
 * Handles creator form submissions and stores data in GitHub
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class GitHubCreatorAPI {
    constructor() {
        this.creatorsDir = path.join(__dirname, '..', 'creators');
        this.creatorsDataFile = path.join(this.creatorsDir, 'creators-data.json');
        this.uploadsDir = path.join(this.creatorsDir, 'uploads');
        
        this.setupDirectories();
        this.loadCreatorsData();
    }

    setupDirectories() {
        // Create creators directory if it doesn't exist
        if (!fs.existsSync(this.creatorsDir)) {
            fs.mkdirSync(this.creatorsDir, { recursive: true });
        }
        
        // Create uploads directory for project files
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }

    loadCreatorsData() {
        try {
            if (fs.existsSync(this.creatorsDataFile)) {
                this.creatorsData = JSON.parse(fs.readFileSync(this.creatorsDataFile, 'utf8'));
            } else {
                this.creatorsData = {
                    creators: [],
                    totalSubmissions: 0,
                    totalEarnings: 0,
                    lastUpdated: new Date().toISOString()
                };
                this.saveCreatorsData();
            }
        } catch (error) {
            console.error('Error loading creators data:', error);
            this.creatorsData = {
                creators: [],
                totalSubmissions: 0,
                totalEarnings: 0,
                lastUpdated: new Date().toISOString()
            };
        }
    }

    saveCreatorsData() {
        try {
            this.creatorsData.lastUpdated = new Date().toISOString();
            fs.writeFileSync(this.creatorsDataFile, JSON.stringify(this.creatorsData, null, 2));
        } catch (error) {
            console.error('Error saving creators data:', error);
        }
    }

    /**
     * Process creator submission
     */
    async processCreatorSubmission(formData, files) {
        console.log('🎬 Processing creator submission...');
        
        try {
            // Generate unique creator ID
            const creatorId = this.generateCreatorId();
            
            // Create creator profile
            const creatorProfile = {
                id: creatorId,
                submissionDate: new Date().toISOString(),
                status: 'pending',
                contact: {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    phone: formData.get('phone') || '',
                    location: formData.get('location') || ''
                },
                professional: {
                    experience: formData.get('experience'),
                    specialty: formData.get('specialty'),
                    portfolio: formData.get('portfolio') || '',
                    socialMedia: formData.get('socialMedia') || ''
                },
                projects: {
                    description: formData.get('projectDescription'),
                    count: parseInt(formData.get('projectCount')) || 1,
                    estimatedValue: parseInt(formData.get('estimatedValue')) || 100
                },
                payment: {
                    method: formData.get('paymentMethod'),
                    paypalEmail: formData.get('paypalEmail') || '',
                    amount: 0,
                    status: 'pending'
                },
                files: []
            };

            // Process uploaded files
            if (files && files.length > 0) {
                for (const file of files) {
                    if (file.name.endsWith('.prproj')) {
                        const fileInfo = await this.processProjectFile(file, creatorId);
                        creatorProfile.files.push(fileInfo);
                    }
                }
            }

            // Add to creators data
            this.creatorsData.creators.push(creatorProfile);
            this.creatorsData.totalSubmissions++;
            this.saveCreatorsData();

            // Generate GitHub commit
            await this.commitToGitHub(creatorProfile);

            console.log(`✅ Creator submission processed: ${creatorId}`);
            return {
                success: true,
                creatorId: creatorId,
                message: 'Submission processed successfully'
            };

        } catch (error) {
            console.error('❌ Error processing creator submission:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process uploaded project file
     */
    async processProjectFile(file, creatorId) {
        const fileName = `${creatorId}_${Date.now()}_${file.name}`;
        const filePath = path.join(this.uploadsDir, fileName);
        
        // Save file info (in real implementation, you'd save the actual file)
        const fileInfo = {
            originalName: file.name,
            savedName: fileName,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString(),
            status: 'uploaded'
        };

        console.log(`📁 Project file processed: ${file.name} -> ${fileName}`);
        return fileInfo;
    }

    /**
     * Generate unique creator ID
     */
    generateCreatorId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `creator_${timestamp}_${random}`;
    }

    /**
     * Commit creator data to GitHub
     */
    async commitToGitHub(creatorProfile) {
        return new Promise((resolve, reject) => {
            const commitMessage = `Add creator: ${creatorProfile.contact.fullName} (${creatorProfile.id})`;
            
            // Git commands to add and commit the new creator data
            const commands = [
                `cd "${path.join(__dirname, '..')}"`,
                'git add creators/',
                `git commit -m "${commitMessage}"`,
                'git push origin main'
            ];

            const fullCommand = commands.join(' && ');
            
            console.log('🔄 Committing to GitHub...');
            
            exec(fullCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error('❌ Git commit error:', error);
                    reject(error);
                } else {
                    console.log('✅ Successfully committed to GitHub');
                    resolve();
                }
            });
        });
    }

    /**
     * Get creator statistics
     */
    getCreatorStats() {
        const stats = {
            totalCreators: this.creatorsData.creators.length,
            totalSubmissions: this.creatorsData.totalSubmissions,
            totalEarnings: this.creatorsData.totalEarnings,
            pendingReviews: this.creatorsData.creators.filter(c => c.status === 'pending').length,
            approvedCreators: this.creatorsData.creators.filter(c => c.status === 'approved').length,
            specialties: this.getSpecialtyBreakdown(),
            lastUpdated: this.creatorsData.lastUpdated
        };

        return stats;
    }

    /**
     * Get specialty breakdown
     */
    getSpecialtyBreakdown() {
        const specialties = {};
        
        this.creatorsData.creators.forEach(creator => {
            const specialty = creator.professional.specialty;
            specialties[specialty] = (specialties[specialty] || 0) + 1;
        });

        return specialties;
    }

    /**
     * Update creator status
     */
    updateCreatorStatus(creatorId, status, paymentAmount = 0) {
        const creator = this.creatorsData.creators.find(c => c.id === creatorId);
        
        if (creator) {
            creator.status = status;
            creator.payment.amount = paymentAmount;
            creator.payment.status = status === 'approved' ? 'paid' : 'pending';
            creator.lastUpdated = new Date().toISOString();
            
            if (status === 'approved') {
                this.creatorsData.totalEarnings += paymentAmount;
            }
            
            this.saveCreatorsData();
            return true;
        }
        
        return false;
    }

    /**
     * Get creator by ID
     */
    getCreatorById(creatorId) {
        return this.creatorsData.creators.find(c => c.id === creatorId);
    }

    /**
     * Get all creators
     */
    getAllCreators() {
        return this.creatorsData.creators;
    }

    /**
     * Export creators data
     */
    exportCreatorsData() {
        const exportData = {
            ...this.creatorsData,
            exportDate: new Date().toISOString(),
            stats: this.getCreatorStats()
        };

        const exportFile = path.join(this.creatorsDir, `creators-export-${Date.now()}.json`);
        fs.writeFileSync(exportFile, JSON.stringify(exportData, null, 2));
        
        return exportFile;
    }
}

// Export for use in other modules
module.exports = GitHubCreatorAPI;

// Run test if executed directly
if (require.main === module) {
    const api = new GitHubCreatorAPI();
    
    console.log('🎬 Edit.ai GitHub Creator API');
    console.log('=============================\n');
    
    console.log('📊 Creator Statistics:');
    const stats = api.getCreatorStats();
    console.log(`Total Creators: ${stats.totalCreators}`);
    console.log(`Total Submissions: ${stats.totalSubmissions}`);
    console.log(`Pending Reviews: ${stats.pendingReviews}`);
    console.log(`Approved Creators: ${stats.approvedCreators}`);
    console.log(`Total Earnings: $${stats.totalEarnings}`);
    
    console.log('\n🎨 Specialty Breakdown:');
    Object.entries(stats.specialties).forEach(([specialty, count]) => {
        console.log(`${specialty}: ${count} creators`);
    });
    
    console.log('\n✅ GitHub Creator API initialized successfully!');
}
