
            // Direct ExtendScript test
            try {
                $.writeln("=== Edit.ai Direct Test ===");
                $.writeln("ExtendScript is running!");
                
                // Test basic ExtendScript functionality
                var testArray = [1, 2, 3, 4, 5];
                $.writeln("Array test: " + testArray.join(", "));
                
                // Test string manipulation
                var testString = "Edit.ai is working!";
                $.writeln("String test: " + testString);
                
                // Test date functionality
                var now = new Date();
                $.writeln("Date test: " + now.toString());
                
                // Test file path handling
                var testPath = "/Users/codycochran/Downloads/cochran-films-landing/edit-ai/test-projects";
                $.writeln("Test path: " + testPath);
                
                $.writeln("=== Test Complete ===");
                "SUCCESS";
            } catch (error) {
                $.writeln("Error: " + error.message);
                "FAILED";
            }
        