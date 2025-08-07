# 🚀 Edit.ai - Quick Start Guide

## 🎯 First Test: Basic Proof of Concept

This guide will help you get the first working test of Edit.ai up and running quickly.

---

## 📋 Prerequisites

### **Required Software:**
- ✅ **Adobe Premiere Pro 2024** (or 2023)
- ✅ **Node.js 18+** 
- ✅ **Git**

### **System Requirements:**
- ✅ **macOS 10.15+** or **Windows 10/11**
- ✅ **16GB RAM** minimum (32GB recommended)
- ✅ **50GB free space** for projects and media

---

## 🚀 Quick Setup (30 minutes)

### **Step 1: Clone and Setup**
```bash
# Navigate to your project directory
cd /Users/codycochran/Downloads/cochran-films-landing

# Install dependencies
cd edit-ai
npm install

# Verify installation
npm test
```

### **Step 2: Configure Premiere Pro Path**
Edit `scripts/bridge-controller.js` and update the Premiere Pro path:

**macOS:**
```javascript
return '/Applications/Adobe Premiere Pro 2024/Adobe Premiere Pro 2024.app/Contents/MacOS/Adobe Premiere Pro 2024';
```

**Windows:**
```javascript
return 'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2024\\Adobe Premiere Pro.exe';
```

### **Step 3: Test Basic Integration**
```bash
# Test Premiere Pro connection
npm run test:premiere

# Test style loading
npm run test:styles

# Test media analysis
npm run test:media
```

---

## 🎬 First Test: Simple Video Processing

### **Test 1: Basic Premiere Pro Integration**

#### **Create Test Video:**
```bash
# Create a test video file (if you don't have one)
ffmpeg -f lavfi -i testsrc=duration=10:size=1280x720:rate=30 -c:v libx264 test-video.mp4
```

#### **Run Basic Test:**
```bash
# Test basic Premiere Pro automation
node scripts/test-basic-integration.js --video test-video.mp4 --style cinematic
```

#### **Expected Result:**
- ✅ Premiere Pro opens automatically
- ✅ New project created
- ✅ Video imported
- ✅ Basic timeline created
- ✅ Project saved

### **Test 2: Style Application**

#### **Test Cinematic Style:**
```bash
# Test cinematic style processing
node scripts/test-style-processing.js --video test-video.mp4 --style cinematic
```

#### **Expected Result:**
- ✅ Video analyzed for duration and content
- ✅ Cinematic style applied
- ✅ Color grading applied
- ✅ Transitions added
- ✅ Export completed

### **Test 3: Multi-Version Processing**

#### **Test Multiple Styles:**
```bash
# Test multiple style processing
node scripts/test-multi-version.js --video test-video.mp4 --styles cinematic,vlog,corporate
```

#### **Expected Result:**
- ✅ 3 different versions created
- ✅ Each with different editing style
- ✅ All exports completed successfully
- ✅ Quality verification passed

---

## 🔧 Development Commands

### **Basic Commands:**
```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Clean temporary files
npm run clean
```

### **Testing Commands:**
```bash
# Test specific components
npm run test:premiere
npm run test:styles
npm run test:media
npm run test:bridge

# Test with sample media
npm run test:with-media

# Performance testing
npm run test:performance
```

### **Debug Commands:**
```bash
# Debug Premiere Pro integration
npm run debug:premiere

# Debug style processing
npm run debug:styles

# Debug media analysis
npm run debug:media

# Full system debug
npm run debug:full
```

---

## 📊 Success Criteria

### **Technical Success:**
- ✅ **Premiere Pro Integration**: Can open, create projects, import media
- ✅ **Style Application**: Can apply different editing styles
- ✅ **Export Functionality**: Can export videos in different formats
- ✅ **Error Handling**: Graceful error handling and recovery
- ✅ **Performance**: Processing time under 5 minutes per video

### **Quality Success:**
- ✅ **Video Quality**: Professional standard output
- ✅ **Style Accuracy**: 95%+ accuracy in style application
- ✅ **File Management**: Proper file organization and cleanup
- ✅ **User Experience**: Intuitive and responsive interface

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. Premiere Pro Not Found**
```bash
# Check Premiere Pro installation
ls "/Applications/Adobe Premiere Pro 2024/"

# Update path in bridge-controller.js
# Verify Adobe Creative Cloud is installed
```

#### **2. ExtendScript Execution Failed**
```bash
# Check ExtendScript permissions
chmod +x scripts/premiere-controller.jsx

# Verify Premiere Pro is licensed
# Check Adobe Creative Cloud subscription
```

#### **3. Media Import Issues**
```bash
# Check file formats
ffprobe your-video.mp4

# Verify file permissions
ls -la your-video.mp4

# Check available disk space
df -h
```

#### **4. Export Failures**
```bash
# Check export directory permissions
mkdir -p exports
chmod 755 exports

# Verify disk space
df -h

# Check Premiere Pro export settings
```

### **Debug Mode:**
```bash
# Enable debug logging
DEBUG=* npm run test:premiere

# Check logs
tail -f logs/premiere.log
tail -f logs/bridge.log
```

---

## 📈 Next Steps After First Test

### **If Test Successful:**
1. **Expand Style Library** - Add more editing styles
2. **Improve UI** - Enhance user interface
3. **Add Analytics** - Track usage and performance
4. **Security Audit** - Implement security measures
5. **Performance Optimization** - Speed up processing

### **If Test Fails:**
1. **Debug Issues** - Identify and fix problems
2. **Simplify Approach** - Start with basic functionality
3. **Document Problems** - Record issues for future reference
4. **Seek Help** - Consult Adobe documentation or community

---

## 🎯 Success Metrics

### **First Test Success:**
- ✅ **Basic Integration**: Premiere Pro opens and responds
- ✅ **Media Processing**: Video files can be imported
- ✅ **Style Application**: At least one style works
- ✅ **Export Functionality**: Videos can be exported
- ✅ **Error Handling**: System handles errors gracefully

### **Quality Metrics:**
- ✅ **Processing Time**: < 10 minutes for first test
- ✅ **Video Quality**: Acceptable output quality
- ✅ **System Stability**: No crashes or hangs
- ✅ **User Experience**: Basic workflow works

---

## 💡 Tips for Success

### **Before Testing:**
1. **Close Premiere Pro** - Ensure clean startup
2. **Clear Cache** - Remove temporary files
3. **Check Permissions** - Verify file access rights
4. **Test with Small Files** - Start with short videos

### **During Testing:**
1. **Monitor System Resources** - Watch CPU and memory usage
2. **Check Logs** - Monitor error and debug logs
3. **Take Screenshots** - Document any issues
4. **Note Performance** - Track processing times

### **After Testing:**
1. **Document Results** - Record what worked and what didn't
2. **Clean Up** - Remove test files and temporary data
3. **Plan Next Steps** - Decide what to improve next
4. **Share Feedback** - Report issues or successes

---

**🎬 Ready to revolutionize video editing? Let's make this first test a success!** 🚀
