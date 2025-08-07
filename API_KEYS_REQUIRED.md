# 🔑 API Keys & Services Required for Edit.ai

## 🚀 **Production Deployment Requirements**

### **1. Payment Processing APIs**

#### **Stripe (Primary Payment Processor)**
- **Purpose**: Process creator payments, style marketplace sales
- **API Keys Needed**:
  - `STRIPE_PUBLISHABLE_KEY` - Frontend payment forms
  - `STRIPE_SECRET_KEY` - Backend payment processing
  - `STRIPE_WEBHOOK_SECRET` - Payment event notifications
- **Cost**: 2.9% + 30¢ per transaction
- **Setup**: https://dashboard.stripe.com/apikeys

#### **PayPal (Alternative Payment)**
- **Purpose**: International payments, creator preference
- **API Keys Needed**:
  - `PAYPAL_CLIENT_ID` - PayPal SDK integration
  - `PAYPAL_CLIENT_SECRET` - Backend PayPal API
- **Cost**: 2.9% + fixed fee per transaction
- **Setup**: https://developer.paypal.com/

### **2. Cloud Hosting & Infrastructure**

#### **AWS (Amazon Web Services)**
- **Purpose**: Production hosting, file storage, database
- **API Keys Needed**:
  - `AWS_ACCESS_KEY_ID` - AWS SDK authentication
  - `AWS_SECRET_ACCESS_KEY` - AWS SDK authentication
  - `AWS_REGION` - Service region (e.g., us-east-1)
- **Services**:
  - **EC2**: Server hosting ($10-50/month)
  - **S3**: File storage ($0.023/GB/month)
  - **RDS**: PostgreSQL database ($25-100/month)
  - **CloudFront**: CDN for global delivery
- **Setup**: https://aws.amazon.com/

#### **Vercel (Alternative Hosting)**
- **Purpose**: Frontend hosting, serverless functions
- **API Keys Needed**:
  - `VERCEL_TOKEN` - Deployment automation
- **Cost**: Free tier available, $20/month for Pro
- **Setup**: https://vercel.com/

### **3. Database & Storage**

#### **PostgreSQL (Production Database)**
- **Purpose**: Store creator data, payment records, style metadata
- **API Keys Needed**:
  - `DATABASE_URL` - Connection string
  - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- **Providers**:
  - **AWS RDS**: $25-100/month
  - **Heroku Postgres**: $5-50/month
  - **Supabase**: Free tier, $25/month Pro

#### **Cloud Storage (File Uploads)**
- **Purpose**: Store uploaded .prproj files, video assets
- **API Keys Needed**:
  - `CLOUD_STORAGE_BUCKET` - Storage bucket name
  - `CLOUD_STORAGE_KEY` - Access credentials
- **Providers**:
  - **AWS S3**: $0.023/GB/month
  - **Google Cloud Storage**: $0.020/GB/month
  - **Azure Blob Storage**: $0.0184/GB/month

### **4. Email & Communication**

#### **SendGrid (Email Service)**
- **Purpose**: Creator notifications, payment confirmations
- **API Keys Needed**:
  - `SENDGRID_API_KEY` - Email sending
  - `SENDGRID_FROM_EMAIL` - Sender email address
- **Cost**: Free tier (100 emails/day), $14.95/month for 50k emails
- **Setup**: https://sendgrid.com/

#### **Twilio (SMS Notifications)**
- **Purpose**: SMS alerts for payments, creator updates
- **API Keys Needed**:
  - `TWILIO_ACCOUNT_SID` - Twilio account identifier
  - `TWILIO_AUTH_TOKEN` - Authentication token
  - `TWILIO_PHONE_NUMBER` - Sender phone number
- **Cost**: $0.0079 per SMS
- **Setup**: https://www.twilio.com/

### **5. Analytics & Monitoring**

#### **Google Analytics**
- **Purpose**: Track user behavior, conversion rates
- **API Keys Needed**:
  - `GA_TRACKING_ID` - Google Analytics ID
- **Cost**: Free
- **Setup**: https://analytics.google.com/

#### **Sentry (Error Monitoring)**
- **Purpose**: Track application errors, performance
- **API Keys Needed**:
  - `SENTRY_DSN` - Sentry project URL
- **Cost**: Free tier available, $26/month for Pro
- **Setup**: https://sentry.io/

### **6. Security & Authentication**

#### **JWT (JSON Web Tokens)**
- **Purpose**: User authentication, session management
- **API Keys Needed**:
  - `JWT_SECRET` - Secret key for token signing
- **Cost**: Free (built into Node.js)

#### **bcrypt (Password Hashing)**
- **Purpose**: Secure password storage
- **API Keys Needed**: None (library)
- **Cost**: Free

### **7. Domain & SSL**

#### **Domain Registration**
- **Purpose**: Professional domain name
- **Providers**:
  - **Namecheap**: $10-15/year
  - **GoDaddy**: $12-20/year
  - **Google Domains**: $12/year

#### **SSL Certificate**
- **Purpose**: HTTPS encryption
- **Providers**:
  - **Let's Encrypt**: Free
  - **Cloudflare**: Free
  - **AWS Certificate Manager**: Free

### **8. Development & Testing**

#### **GitHub (Version Control)**
- **Purpose**: Code repository, CI/CD
- **API Keys Needed**:
  - `GITHUB_TOKEN` - GitHub API access
- **Cost**: Free for public repos, $4/month for private

#### **Jest (Testing Framework)**
- **Purpose**: Automated testing
- **API Keys Needed**: None
- **Cost**: Free

## 📋 **Environment Variables Setup**

Create a `.env` file with all required keys:

```bash
# Payment Processing
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...

# Cloud Hosting
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
VERCEL_TOKEN=...

# Database
DATABASE_URL=postgresql://...
DB_HOST=localhost
DB_PORT=5432
DB_NAME=editai
DB_USER=postgres
DB_PASSWORD=...

# Storage
CLOUD_STORAGE_BUCKET=editai-uploads
CLOUD_STORAGE_KEY=...

# Email & Communication
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@edit.ai
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Analytics
GA_TRACKING_ID=G-...
SENTRY_DSN=https://...

# Security
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=3000
```

## 💰 **Estimated Monthly Costs**

| Service | Cost Range | Purpose |
|---------|------------|---------|
| **AWS EC2** | $10-50 | Server hosting |
| **AWS S3** | $5-20 | File storage |
| **AWS RDS** | $25-100 | Database |
| **Stripe** | 2.9% + 30¢ | Payment processing |
| **SendGrid** | $14.95 | Email service |
| **Domain** | $1-2 | Domain registration |
| **SSL** | Free | HTTPS encryption |
| **Total** | **$55-182 + 2.9%** | **Monthly operational cost** |

## 🚀 **Implementation Priority**

### **Phase 1: Essential (Launch)**
1. **Stripe** - Payment processing
2. **AWS EC2** - Server hosting
3. **PostgreSQL** - Database
4. **Domain + SSL** - Professional presence

### **Phase 2: Growth (Month 2-3)**
1. **SendGrid** - Email automation
2. **Google Analytics** - User tracking
3. **Sentry** - Error monitoring
4. **AWS S3** - File storage

### **Phase 3: Scale (Month 4+)**
1. **Twilio** - SMS notifications
2. **PayPal** - Alternative payments
3. **CDN** - Global performance
4. **Advanced monitoring**

## 🔧 **Setup Instructions**

### **1. Stripe Setup**
```bash
# Install Stripe
npm install stripe

# Add to server.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### **2. AWS Setup**
```bash
# Install AWS SDK
npm install aws-sdk

# Configure AWS
const AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
```

### **3. Database Setup**
```bash
# Install PostgreSQL client
npm install pg

# Add to server.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
```

### **4. Email Setup**
```bash
# Install SendGrid
npm install @sendgrid/mail

# Configure SendGrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

## 🛡️ **Security Best Practices**

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** (every 90 days)
4. **Use least privilege** access for AWS IAM
5. **Enable 2FA** on all service accounts
6. **Monitor usage** for unusual activity
7. **Backup keys** securely

## 📞 **Support Resources**

- **Stripe Documentation**: https://stripe.com/docs
- **AWS Documentation**: https://docs.aws.amazon.com/
- **SendGrid Documentation**: https://sendgrid.com/docs/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/

---

**Total Estimated Setup Time: 2-4 hours**
**Total Monthly Cost: $55-182 + 2.9% transaction fees**
**Revenue Break-even: 10-20 creator submissions per month**
