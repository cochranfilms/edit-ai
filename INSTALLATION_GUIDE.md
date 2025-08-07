# 🚀 AI Video Editor - Installation Guide

## World's First Automated Premiere Pro Editing System

This guide will walk you through setting up the revolutionary AI-powered video editing system that automates Adobe Premiere Pro.

## 📋 Prerequisites

### System Requirements
- **Operating System**: macOS 10.15+ or Windows 10/11
- **Adobe Premiere Pro**: 2024 version (recommended) or 2023
- **Node.js**: Version 16.0 or higher
- **RAM**: 16GB minimum (32GB recommended)
- **Storage**: 50GB free space for projects and media

### Required Software
1. **Adobe Premiere Pro** (Latest version)
2. **Node.js** - Download from [nodejs.org](https://nodejs.org/)
3. **Git** (for version control)

## 🛠️ Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/ai-video-editor.git
cd ai-video-editor
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Premiere Pro Path
Edit the `scripts/bridge-controller.js` file and update the Premiere Pro path for your system:

**macOS:**
```javascript
return '/Applications/Adobe Premiere Pro 2024/Adobe Premiere Pro 2024.app/Contents/MacOS/Adobe Premiere Pro 2024';
```

**Windows:**
```javascript
return 'C:\\Program Files\\Adobe\\Adobe Premiere Pro 2024\\Adobe Premiere Pro.exe';
```

### Step 4: Set Up ExtendScript Environment

#### For macOS:
1. Open Terminal
2. Navigate to the project directory
3. Run the setup script:
```bash
chmod +x scripts/setup-macos.sh
./scripts/setup-macos.sh
```

#### For Windows:
1. Open Command Prompt as Administrator
2. Navigate to the project directory
3. Run the setup script:
```bash
scripts/setup-windows.bat
```

### Step 5: Verify Installation
```bash
npm test
```

## 🎯 Quick Start

### 1. Launch the Web Interface
```bash
npm start
```

### 2. Open Your Browser
Navigate to: `http://localhost:3000`

### 3. Select Your Style
- Choose from: Cinematic, Vlog, Corporate, Music Video, Documentary, Social Media
- Each style has predefined editing patterns and effects

### 4. Select Media Folder
- Choose a folder containing your video and audio files
- Supported formats: MP4, MOV, AVI, M4V, MKV, WAV, MP3, AAC

### 5. Start Automated Editing
- Click "Start Automated Editing"
- Watch as Premiere Pro automatically processes your video
- Find your finished video in the specified output location

## 📁 Project Structure

```
premiere-pro-automation/
├── styles/                    # Style definitions
│   ├── cinematic.json
│   ├── vlog.json
│   └── corporate.json
├── scripts/                   # Core automation scripts
│   ├── premiere-controller.jsx
│   ├── bridge-controller.js
│   └── media-analyzer.js
├── web-interface/            # User interface
│   ├── style-selector.html
│   └── progress-tracker.html
├── templates/                # Project templates
│   ├── project-templates/
│   └── effect-presets/
└── temp/                    # Temporary files
```

## 🔧 Configuration

### Custom Style Creation
1. Create a new JSON file in the `styles/` directory
2. Follow the style template structure
3. Define your editing patterns, transitions, and effects

Example style template:
```json
{
  "style": "your-style-name",
  "name": "Your Style Name",
  "description": "Description of your editing style",
  "pacing": {
    "type": "your-pacing-type",
    "average_shot_duration": 3.0
  },
  "transitions": [
    {
      "type": "cross-dissolve",
      "duration": 1.0,
      "frequency": 0.7
    }
  ],
  "effects": [
    {
      "type": "color-grading",
      "preset": "your-preset",
      "intensity": 0.8
    }
  ]
}
```

### Advanced Configuration
Edit `config/settings.json` to customize:
- Default export settings
- Media file extensions
- Premiere Pro preferences
- Performance settings

## 🚨 Troubleshooting

### Common Issues

#### 1. Premiere Pro Not Found
**Error**: "Premiere Pro executable not found"
**Solution**: Update the path in `bridge-controller.js` to match your installation

#### 2. ExtendScript Execution Failed
**Error**: "ExtendScript execution failed"
**Solution**: 
- Ensure Premiere Pro is installed and licensed
- Check that the ExtendScript file has proper permissions
- Verify Node.js version compatibility

#### 3. Media Import Issues
**Error**: "No supported media files found"
**Solution**:
- Check file extensions are supported
- Ensure files are not corrupted
- Verify folder permissions

#### 4. Export Failures
**Error**: "Export failed"
**Solution**:
- Check available disk space
- Ensure output path is writable
- Verify Premiere Pro has necessary permissions

### Debug Mode
Enable debug logging:
```bash
npm start --debug
```

### Log Files
Check logs in:
- `logs/premiere.log` - Premiere Pro execution logs
- `logs/bridge.log` - Bridge controller logs
- `logs/web.log` - Web interface logs

## 🔒 Security Considerations

### File Permissions
- Ensure the application has read access to media folders
- Grant write permissions to output directories
- Consider using a dedicated user account for automation

### Adobe Licensing
- Ensure your Adobe Premiere Pro license is active
- Consider using a dedicated Adobe account for automation
- Be aware of Adobe's terms of service regarding automation

## 📈 Performance Optimization

### System Tuning
1. **RAM**: Allocate more RAM to Premiere Pro
2. **Storage**: Use SSD for faster media access
3. **GPU**: Enable GPU acceleration in Premiere Pro
4. **CPU**: Close unnecessary applications during processing

### Batch Processing
For multiple videos:
```bash
npm run batch -- --style cinematic --input /path/to/folder --output /path/to/output
```

## 🤝 Support

### Getting Help
1. Check the troubleshooting section above
2. Review the logs for error details
3. Search existing issues on GitHub
4. Create a new issue with detailed information

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Adobe for Premiere Pro and ExtendScript
- The open-source community for inspiration
- Early adopters and beta testers

---

**🎬 Ready to revolutionize video editing? Start your automated editing journey today!**
