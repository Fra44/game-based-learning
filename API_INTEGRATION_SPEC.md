# API Integration Specification for Discovery Scanner

## Overview
This document outlines the API endpoints and data structures needed to integrate real ML image recognition, GPS verification, and AI-powered content generation with the Discovery Scanner.

## API Endpoints

### 1. Image Recognition API

**Endpoint:** `POST /api/scan/recognize`

**Purpose:** Verify that the camera is pointed at the correct landmark using ML image recognition.

**Request:**
```typescript
interface RecognizeRequest {
  image: string; // Base64 encoded image from camera
  landmarkId: number;
  userLocation: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}
```

**Response:**
```typescript
interface RecognizeResponse {
  success: boolean;
  confidence: number; // 0-1 confidence score
  recognizedLandmark: {
    id: number;
    name: string;
    matchPercentage: number;
  } | null;
  error?: string;
}
```

**Example Implementation:**
```typescript
const recognizeLandmark = async (imageData: string, landmarkId: number) => {
  const response = await fetch('/api/scan/recognize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageData,
      landmarkId,
      userLocation: await getUserLocation(),
      timestamp: Date.now()
    })
  });
  return response.json();
};
```

### 2. GPS Verification API

**Endpoint:** `POST /api/scan/verify-location`

**Purpose:** Confirm user is within acceptable range of the landmark.

**Request:**
```typescript
interface VerifyLocationRequest {
  landmarkId: number;
  userLocation: {
    latitude: number;
    longitude: number;
  };
  accuracy: number; // GPS accuracy in meters
}
```

**Response:**
```typescript
interface VerifyLocationResponse {
  isNearby: boolean;
  distance: number; // Distance in meters
  requiredDistance: number; // Maximum allowed distance
  canScan: boolean;
}
```

### 3. AI Summary Generation API

**Endpoint:** `POST /api/content/generate-summary`

**Purpose:** Generate educational content using OpenAI API.

**Request:**
```typescript
interface GenerateSummaryRequest {
  landmarkId: number;
  landmarkName: string;
  category: string;
  year: string;
  userLanguage?: string; // Default: 'en'
  includeTrivia?: boolean; // Default: true
}
```

**Response:**
```typescript
interface GenerateSummaryResponse {
  summary: string;
  trivia: string[];
  historicalContext: string;
  culturalSignificance: string;
  interestingFacts: string[];
  sources: string[];
  generatedAt: number;
}
```

**OpenAI Integration Example:**
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateLandmarkSummary(landmark: Landmark) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a knowledgeable tour guide providing engaging, educational content about historical landmarks. Keep responses concise (2-3 paragraphs) and suitable for general audiences."
      },
      {
        role: "user",
        content: `Generate an informative summary about ${landmark.name}, a ${landmark.category} landmark established in ${landmark.year}. Include historical context, cultural significance, and interesting facts.`
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  return completion.choices[0].message.content;
}
```

### 4. Discovery Submission API

**Endpoint:** `POST /api/user/submit-discovery`

**Purpose:** Record the discovery and award XP/badges.

**Request:**
```typescript
interface SubmitDiscoveryRequest {
  userId: string;
  landmarkId: number;
  discoveryMethod: 'scan' | 'gps' | 'quiz';
  scanData?: {
    imageConfidence: number;
    verificationTime: number;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}
```

**Response:**
```typescript
interface SubmitDiscoveryResponse {
  success: boolean;
  rewards: {
    xp: number;
    totalXp: number;
    levelUp: boolean;
    newLevel?: number;
    badges: Badge[];
    achievements: Achievement[];
  };
  discoveryCount: number;
  isFirstDiscovery: boolean; // Global first discovery bonus
  rank: number; // User's ranking among all discoverers
}
```

### 5. Leaderboard API

**Endpoint:** `GET /api/leaderboard/landmarks`

**Purpose:** Show discovery statistics and rankings.

**Response:**
```typescript
interface LeaderboardResponse {
  userRank: number;
  userDiscoveries: number;
  totalUsers: number;
  topExplorers: {
    userId: string;
    username: string;
    discoveries: number;
    xp: number;
    badges: number;
  }[];
  recentDiscoveries: {
    username: string;
    landmarkName: string;
    discoveredAt: number;
  }[];
}
```

## Data Models

### Landmark Model
```typescript
interface Landmark {
  id: number;
  name: string;
  category: 'Historic' | 'Military' | 'Architecture' | 'Culture' | 'Royal';
  year: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  description: string;
  imageUrls: string[];
  aiSummary?: string; // Cached AI-generated content
  discoveryRadius: number; // Meters for GPS verification
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  badges: number[];
  facts: string[];
  relatedLandmarks: number[];
}
```

### User Progress Model
```typescript
interface UserProgress {
  userId: string;
  totalXp: number;
  level: number;
  discoveredLandmarks: {
    landmarkId: number;
    discoveredAt: number;
    scanData?: {
      confidence: number;
      method: string;
    };
  }[];
  badges: Badge[];
  achievements: Achievement[];
  streakDays: number;
  lastDiscoveryDate: number;
}
```

### Badge Model
```typescript
interface Badge {
  id: number;
  name: string;
  icon: string;
  category: string;
  description: string;
  earnedAt?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
```

### Achievement Model
```typescript
interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}
```

## ML Image Recognition Implementation

### Using TensorFlow.js

```typescript
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

class LandmarkRecognitionService {
  private model: mobilenet.MobileNet | null = null;

  async initialize() {
    this.model = await mobilenet.load();
  }

  async recognizeLandmark(imageElement: HTMLImageElement, expectedLandmark: string) {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const predictions = await this.model.classify(imageElement);
    
    // Compare predictions with landmark database
    const match = predictions.find(pred => 
      this.matchesLandmark(pred.className, expectedLandmark)
    );

    return {
      success: match !== undefined,
      confidence: match?.probability || 0,
      predictions: predictions.slice(0, 3)
    };
  }

  private matchesLandmark(prediction: string, landmarkName: string): boolean {
    // Implement fuzzy matching logic
    const keywords = landmarkName.toLowerCase().split(' ');
    const predictionLower = prediction.toLowerCase();
    
    return keywords.some(keyword => predictionLower.includes(keyword));
  }
}
```

### Using Google Cloud Vision API

```typescript
import vision from '@google-cloud/vision';

class CloudVisionService {
  private client = new vision.ImageAnnotatorClient();

  async recognizeLandmark(imageBase64: string) {
    const [result] = await this.client.landmarkDetection({
      image: { content: imageBase64 }
    });

    const landmarks = result.landmarkAnnotations;
    
    if (!landmarks || landmarks.length === 0) {
      return {
        success: false,
        landmarks: []
      };
    }

    return {
      success: true,
      landmarks: landmarks.map(landmark => ({
        name: landmark.description,
        confidence: landmark.score,
        location: landmark.locations?.[0]?.latLng
      }))
    };
  }
}
```

## GPS Implementation

```typescript
class LocationService {
  async getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });
  }

  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  isWithinRange(
    userLat: number,
    userLon: number,
    landmarkLat: number,
    landmarkLon: number,
    maxDistance: number = 100
  ): boolean {
    const distance = this.calculateDistance(
      userLat, userLon, landmarkLat, landmarkLon
    );
    return distance <= maxDistance;
  }
}
```

## Camera Access Implementation

```typescript
class CameraService {
  private stream: MediaStream | null = null;

  async startCamera(videoElement: HTMLVideoElement) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      videoElement.srcObject = this.stream;
      await videoElement.play();
      
      return true;
    } catch (error) {
      console.error('Camera access denied:', error);
      return false;
    }
  }

  captureFrame(videoElement: HTMLVideoElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoElement, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
```

## Integration Example in DiscoveryScanner Component

```typescript
// Add to DiscoveryScanner.tsx
import { useState, useEffect, useRef } from 'react';
import { CameraService, LocationService, LandmarkRecognitionService } from './services';

const cameraService = new CameraService();
const locationService = new LocationService();
const recognitionService = new LandmarkRecognitionService();

// Inside component:
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const initializeServices = async () => {
    // Start camera
    if (videoRef.current) {
      await cameraService.startCamera(videoRef.current);
    }

    // Initialize ML model
    await recognitionService.initialize();

    // Get user location
    const position = await locationService.getUserLocation();
    
    // Verify proximity
    const isNearby = locationService.isWithinRange(
      position.coords.latitude,
      position.coords.longitude,
      landmark.location.latitude,
      landmark.location.longitude,
      landmark.discoveryRadius
    );

    if (!isNearby) {
      // Show "too far away" message
      return;
    }

    // Start scanning...
    setScanningState('scanning');
  };

  initializeServices();

  return () => {
    cameraService.stopCamera();
  };
}, [landmark]);
```

## Security Considerations

1. **API Authentication**
   - Use JWT tokens for user authentication
   - Implement rate limiting on scan endpoints
   - Validate user permissions before awarding XP

2. **Image Privacy**
   - Don't store user-submitted images long-term
   - Process images on-device when possible
   - Comply with GDPR and privacy regulations

3. **Anti-Cheating**
   - Verify GPS coordinates server-side
   - Implement cooldown periods between scans
   - Detect and flag suspicious patterns
   - Validate image timestamps

4. **Data Validation**
   - Sanitize all user inputs
   - Validate coordinate ranges
   - Check for impossible discovery times
   - Verify badge eligibility server-side

## Cost Optimization

1. **Cache AI-generated content** - Store summaries in database
2. **Use free tier APIs** - TensorFlow.js runs client-side
3. **Batch requests** - Combine multiple API calls when possible
4. **CDN for images** - Serve landmark images efficiently
5. **Lazy load models** - Only load ML models when needed

## Testing Strategy

1. **Unit Tests** - Test each service independently
2. **Integration Tests** - Test API endpoints
3. **E2E Tests** - Test full discovery flow
4. **Performance Tests** - Measure camera/ML latency
5. **Offline Tests** - Ensure graceful degradation

## Deployment Checklist

- [ ] Configure OpenAI API keys
- [ ] Set up Cloud Vision API credentials
- [ ] Deploy backend API endpoints
- [ ] Configure CORS for mobile apps
- [ ] Set up database for user progress
- [ ] Implement caching layer
- [ ] Configure CDN for assets
- [ ] Set up monitoring and analytics
- [ ] Test on various devices
- [ ] Prepare fallback for API failures
