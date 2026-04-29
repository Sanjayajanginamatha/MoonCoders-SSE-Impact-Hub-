const PptxGenJS = require("pptxgenjs");

// Create a new Presentation
let pres = new PptxGenJS();

// Slide 1: Welcome Slide
let slide1 = pres.addSlide();
slide1.addText("SSE Impact Hub", { x: 1.5, y: 1.5, fontSize: 44, bold: true, color: "36C279", align: "center" });
slide1.addText("A Safe and Transparent Way to Fund NGOs\nBy: MoonCoders Team", { x: 1.5, y: 2.5, fontSize: 24, color: "333333", align: "center" });

// Slide 2: The Big Problem
let slide2 = pres.addSlide();
slide2.addText("Why We Need a Change", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide2.addText([
    { text: "• Hard to Trust: ", options: { bold: true } },
    { text: "People want to donate, but don't know where the money goes.\n" },
    { text: "• Hard for NGOs: ", options: { bold: true } },
    { text: "Good NGOs struggle to raise money safely.\n" },
    { text: "• Tax Hassles: ", options: { bold: true } },
    { text: "Getting tax benefits takes too long with too much paperwork." }
], { x: 0.5, y: 1.5, fontSize: 20, w: "90%" });

// Slide 3: Our Solution
let slide3 = pres.addSlide();
slide3.addText("Our Solution: The SSE Impact Hub", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide3.addText("We built a platform that connects kind people with verified NGOs safely.", { x: 0.5, y: 1.2, fontSize: 20, color: "666666" });
slide3.addText([
    { text: "• 100% Safe: ", options: { bold: true } },
    { text: "We follow strict government rules (SEBI).\n" },
    { text: "• Clear Tracking: ", options: { bold: true } },
    { text: "We use Blockchain to track every single rupee.\n" },
    { text: "• Instant Rewards: ", options: { bold: true } },
    { text: "You get your 80G tax certificate downloaded instantly." }
], { x: 0.5, y: 2.0, fontSize: 20, w: "90%" });

// Slide 4: Behind the Scenes (Tech Stack)
let slide4 = pres.addSlide();
slide4.addText("Behind the Scenes (Tech Setup)", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide4.addText([
    { text: "• Frontend (What you see): ", options: { bold: true } },
    { text: "Built with React. Fast, green, and easy to use.\n" },
    { text: "• Backend (The Brain): ", options: { bold: true } },
    { text: "Built with Java Spring Boot. Handles all the logic safely.\n" },
    { text: "• Database (The Memory): ", options: { bold: true } },
    { text: "PostgreSQL stores all user data safely.\n" },
    { text: "• Blockchain (The Lock): ", options: { bold: true } },
    { text: "Smart Contracts lock the money so it can't be faked." }
], { x: 0.5, y: 1.5, fontSize: 20, w: "90%" });

// Slide 5: Strict Security
let slide5 = pres.addSlide();
slide5.addText("Keeping Bad Actors Out", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide5.addText([
    { text: "1. Identity Check (PAN Card): ", options: { bold: true } },
    { text: "You must provide your real PAN card.\n" },
    { text: "2. Account Check (Demat): ", options: { bold: true } },
    { text: "You must link a real Demat account.\n" },
    { text: "3. No Skipping Rules: ", options: { bold: true } },
    { text: "Our system strictly blocks any payment if checks fail." }
], { x: 0.5, y: 1.5, fontSize: 20, w: "90%" });

// Slide 6: User Journey
let slide6 = pres.addSlide();
slide6.addText("The Step-by-Step Experience", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide6.addText([
    { text: "Step 1: Sign Up & Verify your ID.\n" },
    { text: "Step 2: Choose a Cause (like education or health).\n" },
    { text: "Step 3: Scan & Pay using our safe QR Code scanner.\n" },
    { text: "Step 4: Get your 80G tax receipt instantly." }
], { x: 0.5, y: 1.5, fontSize: 24, w: "90%", bullet: true });

// Slide 7: 80G Certificates
let slide7 = pres.addSlide();
slide7.addText("Instant Tax Documents", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide7.addText("Instead of waiting weeks, our platform gives it to you instantly:", { x: 0.5, y: 1.2, fontSize: 20, color: "666666" });
slide7.addText([
    { text: "• Dynamic Numbers: ", options: { bold: true } },
    { text: "Every receipt gets a unique ID.\n" },
    { text: "• Watermarks: ", options: { bold: true } },
    { text: "Official background branding to prove it's real.\n" },
    { text: "• Digital Signatures: ", options: { bold: true } },
    { text: "Officially signed by the system so it is legally valid." }
], { x: 0.5, y: 2.0, fontSize: 20, w: "90%" });

// Slide 8: What's Next
let slide8 = pres.addSlide();
slide8.addText("What's Next for SSE Impact Hub?", { x: 0.5, y: 0.5, fontSize: 32, bold: true, color: "36C279" });
slide8.addText([
    { text: "• Global Payments: ", options: { bold: true } },
    { text: "Allowing people from other countries to donate easily.\n" },
    { text: "• Mobile App: ", options: { bold: true } },
    { text: "Releasing the app on Android and iPhone.\n" },
    { text: "• NGO Dashboards: ", options: { bold: true } },
    { text: "Giving NGOs tools to show exactly how money is spent." }
], { x: 0.5, y: 1.5, fontSize: 20, w: "90%" });

// Slide 9: Thank You
let slide9 = pres.addSlide();
slide9.addText("Thank You!\nLet's Make an Impact!", { x: 1.5, y: 2.0, fontSize: 44, bold: true, color: "36C279", align: "center" });

// Save the Presentation
pres.writeFile({ fileName: "SSE_Impact_Hub_Presentation.pptx" }).then(() => {
    console.log("-------------------------------------------------");
    console.log("✅ Success! Your real PPT file has been created.");
    console.log("You can find 'SSE_Impact_Hub_Presentation.pptx' in your project folder.");
    console.log("-------------------------------------------------");
});
