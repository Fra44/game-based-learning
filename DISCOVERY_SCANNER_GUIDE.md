# Discovery Scanner - Usage Guide

## Overview
The Discovery Scanner is an interactive AR-style feature that gamifies landmark discovery with ML image recognition simulation, animations, and a reward system.

## How to Use

### Launching the Scanner

There are two ways to activate the Discovery Scanner:

1. **From the Floating Camera Button**
   - Click the purple/pink gradient camera button (bottom-right of the Explore page)
   - This automatically scans the nearest undiscovered landmark

2. **From a Locked Landmark**
   - Click on any gray (undiscovered) landmark pin on the map
   - In the bottom card, click "Scan to Discover"
   - The scanner will target that specific landmark

### Scanning Flow (5 Stages)

#### 1. Initialization (1 second)
- Camera activates with film grain effect
- Shows "Initializing AR Camera..." message
- X button in top-right allows canceling

#### 2. Active Scanning (2.5 seconds)
- Animated reticle with corner brackets appears
- Scanning line moves vertically through the frame
- Progress bar fills from 0% to 100%
- Grid overlay pulses across the screen
- Instruction text: "Point camera at [landmark name]"

#### 3. Recognition (1.5 seconds)
- Sparkle icon spins in a gradient circle
- Ripple effects emanate from center
- "Analyzing image..." with ML recognition message
- Simulates machine learning processing

#### 4. Discovery Celebration (2 seconds)
- 🎉 Confetti explosion animation
- Large checkmark with "Discovery Unlocked!" text
- Landmark name displayed prominently
- Rewards shown:
  - **XP Points**: Random 50-100 XP
  - **Badge**: Category-specific achievement

#### 5. AI Summary (User-controlled)
- Full landmark information displayed:
  - Historical facts
  - Cultural context
  - Year established
  - Category tags
- Reward summary cards
- "Continue Exploring" button returns to map
- "Share Discovery" button for social features

## Technical Details

### State Management
```typescript
type ScanningState = 'initializing' | 'scanning' | 'recognizing' | 'discovered' | 'summary';
```

The component progresses through these states automatically with realistic timing.

### Landmark Interface
```typescript
interface Landmark {
  id: number;
  name: string;
  category: string;
  year: string;
  discovered: boolean;
}
```

### Integration with Explore Page

When a landmark is discovered:
1. The scanner calls `onDiscoveryComplete(landmarkId)`
2. The Explore page updates the landmark's `discovered` status to `true`
3. The map pin transforms from grayscale to colorful
4. The watercolor effect blooms around the discovered area
5. Progress bar updates to reflect new completion percentage

## Customization Points

### Timing Adjustments
Edit delays in `DiscoveryScanner.tsx`:
```typescript
await new Promise(resolve => setTimeout(resolve, 1000)); // Initialization
await new Promise(resolve => setTimeout(resolve, 2500)); // Scanning
await new Promise(resolve => setTimeout(resolve, 1500)); // Recognition
await new Promise(resolve => setTimeout(resolve, 2000)); // Before summary
```

### XP Calculation
Current formula (random 50-100):
```typescript
const xp = Math.floor(Math.random() * 50) + 50;
```

### Badge System
Add more categories in `getBadgeForCategory()`:
```typescript
const badges: { [key: string]: string } = {
  'Historic': '🏛️ History Scholar',
  'Military': '⚔️ Fortress Explorer',
  // Add more here...
};
```

### AI Summaries
Replace `generateAISummary()` with actual OpenAI API call:
```typescript
const generateAISummary = async (landmark: Landmark): Promise<string> => {
  const response = await fetch('/api/openai/generate-summary', {
    method: 'POST',
    body: JSON.stringify({ landmark })
  });
  return response.json();
};
```

## Future Enhancements

### Recommended Additions:

1. **Real Device Camera Access**
   - Use `navigator.mediaDevices.getUserMedia()`
   - Display actual camera feed instead of simulation

2. **GPS Verification**
   - Check user's actual distance from landmark
   - Require proximity (e.g., within 100 meters)

3. **ML Image Recognition**
   - Integrate TensorFlow.js or Cloud Vision API
   - Verify actual landmark in camera view

4. **Sound Effects**
   - Scanning beep sounds
   - Success jingle on discovery
   - Background ambiance

5. **Haptic Feedback**
   - Vibration on successful scan
   - Pulse feedback during scanning

6. **Streak System**
   - Track consecutive daily discoveries
   - Bonus XP for maintaining streaks

7. **Social Features**
   - Share discoveries to social media
   - Compare discoveries with friends
   - Global leaderboard

8. **Collection System**
   - Save collectible cards for each landmark
   - Build a virtual album
   - Trade cards with other players

9. **Quiz Integration**
   - After discovery, offer optional quiz
   - Bonus XP for correct answers
   - Educational content reinforcement

10. **AR Overlays**
    - Historical photos overlaid on camera
    - 3D models of landmarks
    - Virtual tour guide characters

## Testing Checklist

- [ ] Scanner opens from floating camera button
- [ ] Scanner opens from locked landmark card
- [ ] All 5 stages progress smoothly
- [ ] Confetti animation plays
- [ ] XP and badge display correctly
- [ ] AI summary text is readable
- [ ] Close button works at any stage
- [ ] Landmark status updates after discovery
- [ ] Map pin changes from gray to color
- [ ] Progress bar updates correctly
- [ ] Multiple discoveries work sequentially
- [ ] TypeScript compilation has no errors

## Performance Notes

- Animation-heavy component, test on target devices
- Consider reducing confetti particles on lower-end devices
- Lazy load the scanner component if needed
- Optimize images and gradients for mobile

## Accessibility

Current implementation could be enhanced with:
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode
- Motion reduction preferences
- Alternative text for animations
