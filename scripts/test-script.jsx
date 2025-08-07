
// Edit.ai Test Script
// This script tests basic Premiere Pro automation

var app = app || Application.currentApplication();

try {
    $.writeln("=== Edit.ai ExtendScript Test ===");
    $.writeln("Timestamp: " + new Date().toString());
    
    if (app.isRunning) {
        $.writeln("✅ Premiere Pro is running");
        
        // Test project creation
        var project = app.newProject();
        $.writeln("✅ Project created: " + project.name);
        
        // Test timeline creation
        var timeline = project.createNewTimeline("Edit.ai Test Timeline");
        $.writeln("✅ Timeline created: " + timeline.name);
        
        // Close project
        project.close();
        $.writeln("✅ Project closed successfully");
        
        $.writeln("🎉 All tests passed!");
        alert("Edit.ai ExtendScript test completed successfully!");
        
    } else {
        $.writeln("❌ Premiere Pro is not running");
        alert("Please start Premiere Pro first");
    }
    
    $.writeln("=== Test Complete ===");
    
} catch (error) {
    $.writeln("❌ Error: " + error.message);
    alert("ExtendScript test failed: " + error.message);
}
