#!/usr/bin/env node

/**
 * Edit.ai - Payment Processor
 * Handles creator compensation and payment processing
 */

const fs = require('fs');
const path = require('path');

class PaymentProcessor {
    constructor() {
        this.creatorsDataPath = path.join(__dirname, '..', 'creators', 'creators-data.json');
        this.paymentRates = {
            'cinematic': { base: 150, complexity: 50 },
            'vlog': { base: 100, complexity: 30 },
            'corporate': { base: 120, complexity: 40 },
            'music-video': { base: 180, complexity: 60 },
            'documentary': { base: 140, complexity: 45 },
            'social-media': { base: 80, complexity: 25 }
        };
    }

    calculatePayment(creatorData) {
        const { experience, specialty, projectCount, estimatedValue } = creatorData;
        
        // Base payment calculation
        let basePayment = 50; // Minimum payment
        
        // Experience multiplier
        const experienceMultipliers = {
            '0-1': 1.0,
            '1-3': 1.2,
            '3-5': 1.4,
            '5-10': 1.6,
            '10+': 1.8
        };
        
        const experienceMultiplier = experienceMultipliers[experience] || 1.0;
        
        // Specialty bonus
        const specialtyBonuses = {
            'wedding': 20,
            'music-video': 30,
            'corporate': 15,
            'educational': 10,
            'documentary': 25,
            'social-media': 5,
            'cinematic': 35,
            'other': 0
        };
        
        const specialtyBonus = specialtyBonuses[specialty] || 0;
        
        // Project count bonus
        const projectBonus = Math.min(projectCount * 10, 50);
        
        // Estimated value consideration
        const valueBonus = Math.min(estimatedValue * 0.1, 100);
        
        // Calculate final payment
        const finalPayment = Math.round(
            (basePayment + specialtyBonus + projectBonus + valueBonus) * experienceMultiplier
        );
        
        return {
            basePayment,
            experienceMultiplier,
            specialtyBonus,
            projectBonus,
            valueBonus,
            finalPayment,
            breakdown: {
                experience: experience,
                specialty: specialty,
                projectCount: projectCount,
                estimatedValue: estimatedValue
            }
        };
    }

    async processCreatorPayment(creatorId) {
        try {
            // Load creators data
            const creatorsData = this.loadCreatorsData();
            const creator = creatorsData.creators.find(c => c.id === creatorId);
            
            if (!creator) {
                throw new Error(`Creator not found: ${creatorId}`);
            }
            
            // Calculate payment
            const payment = this.calculatePayment(creator);
            
            // Update creator data
            creator.payment = payment;
            creator.paymentStatus = 'processed';
            creator.paymentDate = new Date().toISOString();
            
            // Update total earnings
            creatorsData.totalEarnings += payment.finalPayment;
            creatorsData.lastUpdated = new Date().toISOString();
            
            // Save updated data
            this.saveCreatorsData(creatorsData);
            
            console.log(`✅ Payment processed for ${creator.fullName}: $${payment.finalPayment}`);
            
            return {
                success: true,
                creatorId: creatorId,
                payment: payment,
                message: `Payment of $${payment.finalPayment} processed successfully`
            };
            
        } catch (error) {
            console.error('❌ Payment processing failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async processAllPendingPayments() {
        try {
            const creatorsData = this.loadCreatorsData();
            const pendingCreators = creatorsData.creators.filter(c => c.status === 'approved' && !c.payment);
            
            console.log(`💰 Processing payments for ${pendingCreators.length} creators...`);
            
            const results = [];
            for (const creator of pendingCreators) {
                const result = await this.processCreatorPayment(creator.id);
                results.push(result);
            }
            
            console.log(`✅ Processed ${results.filter(r => r.success).length} payments`);
            
            return results;
            
        } catch (error) {
            console.error('❌ Batch payment processing failed:', error.message);
            return [];
        }
    }

    loadCreatorsData() {
        if (fs.existsSync(this.creatorsDataPath)) {
            return JSON.parse(fs.readFileSync(this.creatorsDataPath, 'utf8'));
        }
        return { creators: [], totalSubmissions: 0, totalEarnings: 0 };
    }

    saveCreatorsData(data) {
        fs.writeFileSync(this.creatorsDataPath, JSON.stringify(data, null, 2));
    }

    async generatePaymentReport() {
        const creatorsData = this.loadCreatorsData();
        
        const report = {
            totalCreators: creatorsData.creators.length,
            totalSubmissions: creatorsData.totalSubmissions,
            totalEarnings: creatorsData.totalEarnings,
            pendingPayments: creatorsData.creators.filter(c => c.status === 'approved' && !c.payment).length,
            processedPayments: creatorsData.creators.filter(c => c.payment).length,
            averagePayment: creatorsData.creators.filter(c => c.payment).length > 0 
                ? Math.round(creatorsData.totalEarnings / creatorsData.creators.filter(c => c.payment).length)
                : 0,
            topEarners: creatorsData.creators
                .filter(c => c.payment)
                .sort((a, b) => (b.payment?.finalPayment || 0) - (a.payment?.finalPayment || 0))
                .slice(0, 5)
                .map(c => ({
                    name: c.fullName,
                    specialty: c.specialty,
                    payment: c.payment?.finalPayment || 0
                }))
        };
        
        return report;
    }

    async runPaymentDemo() {
        console.log('💰 Edit.ai - Payment Processor Demo');
        console.log('===================================\n');
        
        // Generate payment report
        const report = await this.generatePaymentReport();
        
        console.log('📊 Payment Statistics:');
        console.log('======================');
        console.log(`👥 Total Creators: ${report.totalCreators}`);
        console.log(`📦 Total Submissions: ${report.totalSubmissions}`);
        console.log(`💰 Total Earnings: $${report.totalEarnings}`);
        console.log(`⏳ Pending Payments: ${report.pendingPayments}`);
        console.log(`✅ Processed Payments: ${report.processedPayments}`);
        console.log(`📈 Average Payment: $${report.averagePayment}`);
        
        if (report.topEarners.length > 0) {
            console.log('\n🏆 Top Earners:');
            report.topEarners.forEach((creator, index) => {
                console.log(`${index + 1}. ${creator.name} (${creator.specialty}): $${creator.payment}`);
            });
        }
        
        console.log('\n💡 Payment System Features:');
        console.log('==========================');
        console.log('✅ Experience-based multipliers');
        console.log('✅ Specialty bonuses');
        console.log('✅ Project count bonuses');
        console.log('✅ Value-based adjustments');
        console.log('✅ Automated processing');
        console.log('✅ Payment tracking');
        
        console.log('\n🚀 Ready for creator compensation!');
    }
}

// Run demo if this script is executed directly
if (require.main === module) {
    const processor = new PaymentProcessor();
    processor.runPaymentDemo().catch(console.error);
}

module.exports = PaymentProcessor;
