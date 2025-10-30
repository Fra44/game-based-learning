# Game Based Learning App "City Explorer"

## Introduction

A location-based learning game that combines real-world exploration with digital discovery.

## Purpose

The app aims to promote experiential, location-based learning about:
- Urban history
- Landmarks
- Animals and plants
- Local heritage

### Learning Aspects
- **Type**: Informal, discovery-based learning with quizzes and mini-games
- **Subjects**: History, geography
- **Context**: Outdoor exploration (city walking tours, museum visits, school field trips)

## Platform
- **Primary**: Mobile App (iOS + Android)
- **Optional**: AR Glasses compatibility (Apple Vision Pro, Ray-Ban Meta smart glass)

## Features
- World exploration with B&W to color progression
- Landmark and museum masterpiece collection
- AI-powered landmark information
- Trip planning capabilities
- Quiz-based point system
- Competitive gameplay with friends
- Interactive minigames
- Virtual teleportation system

## Technology Stack
- AR & object recognition
- GPS positioning
- ML image recognition
- OpenAI API integration

## Visual Style 
**Visual Style:** Hand-painted watercolor aesthetic

- B&W to Color Transition: Locations start as pencil sketches/ink drawings and bloom into vibrant watercolors when discovered
- Why it works: Evokes the feeling of a traveling artist's journal; feels sophisticated yet approachable
- UI Elements: Textured paper backgrounds, brush stroke animations, vintage map aesthetics
- Target Feel: Educational, artistic, thoughtful exploration

## Components

### Explore Page

I've created an interactive mock design for the **Watercolor Atlas Explore Mode**! Here's what I included:

### 🎨 **Watercolor Aesthetic**
- Soft amber/sepia toned background mimicking aged paper
- Subtle watercolor texture overlays
- Colored areas bloom around discovered landmarks
- Grayscale sketch appearance for undiscovered areas

### 🗺️ **Map Elements**
- **Discovered landmarks**: Vibrant watercolor pins with gradient colors (orange/amber/red) and glow effects
- **Undiscovered landmarks**: Grayscale pins with "???" labels
- **User location**: Blue pulsing dot at center
- **Sketched streets**: Dashed lines suggesting hand-drawn map details

### 📍 **Interactive Features**
- Click any landmark to see details in the bottom card
- Progress bar showing discovery completion (2/5 landmarks)
- Distance indicator for locked landmarks
- AR camera button (bottom right) for scanning mode

### 🎯 **UI Components**
- Top navigation with compass, journal, achievements, and profile
- Bottom sheet that slides up with landmark information
- Different states for discovered vs. undiscovered locations
- "Learn More" button for discovered landmarks

### 🎨 **Visual Hierarchy**
- Discovered landmarks have names visible and colorful appearance
- Undiscovered landmarks are muted and mysterious
- Selected landmarks scale up for emphasis

---

### Discovery & Scanning Page

The **AR Scanner** provides an immersive discovery experience when users encounter new landmarks. This feature is triggered by:
1. Clicking the floating camera button (scans nearest undiscovered landmark)
2. Selecting an undiscovered landmark and clicking "Scan to Discover"

### 📱 **Scanning Flow**

#### Stage 1: Initialization
- AR camera activates with film grain effect
- Loading animation with "Initializing AR Camera" message
- Simulates hardware/software preparation

#### Stage 2: Active Scanning
- **Visual Elements:**
  - Corner brackets forming a reticle frame
  - Animated scanning line moving top to bottom
  - Grid overlay with pulsing cells
  - Real-time progress bar (0-100%)
- **User Feedback:**
  - "Scanning landmark..." message
  - Landmark name display
  - Instruction to point camera at landmark

#### Stage 3: Recognition
- ML image recognition simulation
- Spinning sparkle icon in gradient circle
- Ripple animation effect
- "Analyzing image..." status message

#### Stage 4: Discovery Unlocked! 🎉
- **Celebration Animation:**
  - Confetti explosion with colored particles
  - Large success checkmark icon
  - Bouncing "Discovery Unlocked!" text
  - Rippling background effects
- **Rewards Display:**
  - Random XP points (50-100 XP) with star icon
  - Category-specific badge earned
  - Trophy/achievement visualization
- **Sound Design:** (Ready for audio implementation)
  - Success jingle
  - Reward chime

#### Stage 5: AI-Generated Summary
- **Information Display:**
  - Landmark name with decorative header
  - Category and year tags
  - AI-powered historical summary
  - Cultural context and trivia
- **Rewards Summary:**
  - XP earned breakdown
  - Badge collection display
  - Fun facts (e.g., "You're the 347th explorer!")
- **Action Buttons:**
  - "Continue Exploring" (returns to map)
  - "Share Discovery" (social features)

### 🎯 **Technical Features**

- **State Management:** Multi-stage scanning flow with React hooks
- **Animations:** CSS keyframes for confetti, grain, pulse effects
- **Type Safety:** Full TypeScript support with interfaces
- **Simulated ML:** Realistic timing for image recognition (actual ML integration ready)
- **GPS Verification:** Distance calculation placeholder
- **AI Integration:** OpenAI API integration points for landmark summaries
- **Reward System:** Dynamic XP calculation and badge assignment

### 🏆 **Reward Categories**

Different landmark types earn unique badges:
- 🏛️ **History Scholar** - Historic landmarks
- ⚔️ **Fortress Explorer** - Military sites
- 🏗️ **Design Enthusiast** - Architecture
- 🎨 **Culture Curator** - Cultural venues
- 👑 **Royal Heritage** - Royal buildings

### 🎨 **Visual Design**

- Dark gradient background simulating camera view
- Cyan/blue accent colors for scanning UI
- Yellow/orange gradients for success states
- Purple/pink accents for AR features
- Backdrop blur effects for modern glass morphism
- Smooth transitions between all states

### 🔄 **Integration Points**

The scanner integrates seamlessly with the Explore page:
- Updates landmark discovery status in real-time
- Synchronizes with progress tracking
- Maintains state consistency across components
- Triggers map color bloom effect on discovery

