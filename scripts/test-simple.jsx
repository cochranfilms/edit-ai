
// Simple ExtendScript test for Premiere Pro
var app = app || Application.currentApplication();

try {
    // Test basic Premiere Pro access
    if (app.isRunning) {
        $.writeln("Premiere Pro is running");
        
        // Test project creation
        var project = app.newProject();
        $.writeln("Project created: " + project.name);
        
        // Close project
        project.close();
        $.writeln("Project closed successfully");
        
        alert("ExtendScript test completed successfully!");
    } else {
        $.writeln("Premiere Pro is not running");
        alert("Please start Premiere Pro first");
    }
} catch (error) {
    $.writeln("Error: " + error.message);
    alert("ExtendScript test failed: " + error.message);
}
