const fs = require('fs');
const path = require('path');

// The folder where the AI generated the images
const srcDir = 'C:\\Users\\sanja\\.gemini\\antigravity\\brain\\e1e3f107-9550-454b-83fa-d97639c792ab';
const destDir = 'd:\\MoonCoders-SSE-Impact-Hub\\frontend\\public\\images';

// Ensure the destination folder exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Map the generated image filenames
const eduImg = 'ngo_education_1777424684343.png';
const healthImg = 'ngo_healthcare_1777424716663.png';
const envImg = 'ngo_environment_1777424742850.png';

// Copy the files into the frontend/public/images folder
try {
    fs.copyFileSync(path.join(srcDir, eduImg), path.join(destDir, 'ngo_education.png'));
    fs.copyFileSync(path.join(srcDir, healthImg), path.join(destDir, 'ngo_healthcare.png'));
    fs.copyFileSync(path.join(srcDir, envImg), path.join(destDir, 'ngo_environment.png'));
    console.log("✅ Successfully copied generated images to public folder.");
} catch (error) {
    console.error("❌ Error copying images. Make sure the source files exist.", error);
    process.exit(1);
}

// Update the mockData.js file to use these new images instead of stock Unsplash ones
const mockDataPath = 'd:\\MoonCoders-SSE-Impact-Hub\\frontend\\src\\data\\mockData.js';
let content = fs.readFileSync(mockDataPath, 'utf-8');

// Split the file into individual NGO blocks using a regex or simple string replacement
// For simplicity, we'll replace the image URLs dynamically based on keywords in their SDG list
const ngosRegex = /{[\s\S]*?}/g;

const updatedContent = content.replace(ngosRegex, (match) => {
    let newImage = '/images/ngo_education.png'; // default
    
    if (match.includes('Good Health') || match.includes('Sanitation')) {
        newImage = '/images/ngo_healthcare.png';
    } else if (match.includes('Climate Action') || match.includes('Life on Land') || match.includes('Clean Water')) {
        newImage = '/images/ngo_environment.png';
    } else {
        newImage = '/images/ngo_education.png';
    }

    // Replace the existing image property
    return match.replace(/image:\s*["'][^"']+["']/, `image: "${newImage}"`);
});

fs.writeFileSync(mockDataPath, updatedContent, 'utf-8');
console.log("✅ Successfully updated frontend/src/data/mockData.js to use the newly generated images!");
