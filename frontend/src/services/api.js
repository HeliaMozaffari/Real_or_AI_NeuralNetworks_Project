/**
 * API Service Layer
 * 
 * Purpose: Centralized HTTP client for all backend API calls.
 * All API interactions go through this file for consistency and maintainability.
 * 
 * Endpoints:
 * - POST /api/predict     → Image classification (Real vs AI-Generated)
 * - POST /api/gen/summary → Generate AI summary of results
 * - POST /api/chat        → Chat with GenAI assistant
 * - GET  /api/metrics     → Fetch training metrics
 * - GET  /api/health      → Backend health check
 */

import axios from 'axios';

// Get base URL from environment variable, or use empty string for relative paths
// In development, Vite's proxy handles /api/* requests
// In production, set VITE_API_BASE_URL to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for large image uploads
  headers: {
    'Accept': 'application/json',
  },
});

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message from various error formats
    const message = 
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Create a standardized error object
    const standardError = new Error(message);
    standardError.status = error.response?.status || 500;
    standardError.originalError = error;
    
    return Promise.reject(standardError);
  }
);

/**
 * Upload an image and get Real/Fake prediction
 * 
 * @param {File} imageFile - The image file to classify
 * @returns {Promise<{prediction: string, confidence: number, details?: string}>}
 * 
 * @example
 * const result = await uploadImageAndPredict(file);
 * console.log(result.prediction); // "Real" or "Fake"
 * console.log(result.confidence); // 0.93
 */
export async function uploadImageAndPredict(imageFile) {
  // Validate input
  if (!imageFile) {
    throw new Error('No image file provided');
  }

  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validTypes.includes(imageFile.type)) {
    throw new Error('Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.');
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (imageFile.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  // Create FormData for multipart upload
  const formData = new FormData();
  formData.append('image', imageFile);

  // Send POST request with multipart/form-data
  const response = await apiClient.post('/api/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Generate a summary using GenAI
 * 
 * @param {string} text - Text to summarize
 * @param {string} [context] - Optional context for better summaries
 * @returns {Promise<{summary: string}>}
 * 
 * @example
 * const result = await summarizeText("Model predicted Real with 93% confidence", "image classification");
 * console.log(result.summary); // "The model is highly confident..."
 */
export async function summarizeText(text, context = '') {
  if (!text || typeof text !== 'string') {
    throw new Error('Text is required for summarization');
  }

  const response = await apiClient.post('/api/gen/summary', {
    text,
    context,
  });

  return response.data;
}

/**
 * Send a message to the GenAI chat assistant
 * 
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<{reply: string}>}
 * 
 * @example
 * const result = await sendChatMessage([
 *   { role: 'user', content: 'Why did the model think this was fake?' }
 * ]);
 * console.log(result.reply); // "The model detected..."
 */
export async function sendChatMessage(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Messages array is required');
  }

  // Validate message format
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      throw new Error('Each message must have a role and content');
    }
  }

  const response = await apiClient.post('/api/chat', {
    messages,
  });

  return response.data;
}

/**
 * Fetch training metrics from the backend
 * 
 * @returns {Promise<{
 *   epochs: number[],
 *   train_accuracy: number[],
 *   val_accuracy: number[],
 *   train_loss: number[],
 *   val_loss: number[],
 *   confusion_matrix: number[][]
 * }>}
 * 
 * @example
 * const metrics = await getMetrics();
 * console.log(metrics.epochs);        // [1, 2, 3, 4, ...]
 * console.log(metrics.train_accuracy); // [0.7, 0.8, 0.85, ...]
 */
export async function getMetrics() {
  const response = await apiClient.get('/api/metrics');
  return response.data;
}

/**
 * Check backend health status
 * 
 * @returns {Promise<{status: string}>}
 * 
 * @example
 * const health = await checkHealth();
 * console.log(health.status); // "ok"
 */
export async function checkHealth() {
  const response = await apiClient.get('/api/health');
  return response.data;
}

// ========== MOCK FUNCTIONS FOR DEVELOPMENT ==========
// These can be used when the backend is not available

/**
 * Mock prediction for development/testing
 * Simulates a 1-2 second API delay
 */
export async function mockUploadImageAndPredict(imageFile) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly return Real or Fake
  const isReal = Math.random() > 0.5;
  const confidence = 0.75 + Math.random() * 0.2; // 75-95%
  
  return {
    prediction: isReal ? 'Real' : 'Fake',
    confidence: parseFloat(confidence.toFixed(2)),
    details: isReal 
      ? 'The image shows natural skin texture and consistent lighting patterns typical of real photographs.'
      : 'The model detected artifacts in the eye region and inconsistent facial symmetry typical of AI-generated images.',
  };
}

/**
 * Mock metrics for development/testing
 */
export async function mockGetMetrics() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    epochs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    train_accuracy: [0.52, 0.65, 0.73, 0.79, 0.84, 0.87, 0.90, 0.92, 0.94, 0.95],
    val_accuracy: [0.50, 0.62, 0.70, 0.76, 0.80, 0.83, 0.85, 0.87, 0.88, 0.89],
    train_loss: [0.95, 0.78, 0.62, 0.50, 0.42, 0.35, 0.28, 0.23, 0.19, 0.16],
    val_loss: [0.98, 0.82, 0.68, 0.58, 0.50, 0.45, 0.40, 0.37, 0.35, 0.34],
    confusion_matrix: [
      [4250, 350],  // [TN, FP]
      [420, 4980],  // [FN, TP]
    ],
  };
}

/**
 * Mock chat response for development/testing
 */
export async function mockSendChatMessage(messages) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lastMessage = messages[messages.length - 1];
  const userQuery = lastMessage.content.toLowerCase();
  
  // Simple keyword-based mock responses
  if (userQuery.includes('fake') || userQuery.includes('ai')) {
    return {
      reply: 'AI-generated faces often exhibit subtle artifacts in areas like eyes, ears, and hair. Our CNN model learned to detect these patterns by training on 140,000+ images from the GenImage dataset. Common telltale signs include asymmetric earrings, irregular teeth, and unnatural skin textures around facial boundaries.',
    };
  } else if (userQuery.includes('real')) {
    return {
      reply: 'Real photographs show natural variations in lighting, skin texture, and facial features. Our model learned to recognize authentic patterns like consistent shadow casting, natural pore distribution, and realistic hair strands that are difficult for AI generators to replicate perfectly.',
    };
  } else if (userQuery.includes('accuracy') || userQuery.includes('performance')) {
    return {
      reply: 'Our model achieves approximately 89% validation accuracy on the test set. The confusion matrix shows good balance between precision and recall, with slightly more false positives (real images classified as fake) than false negatives.',
    };
  } else {
    return {
      reply: 'I can help explain how our Real vs AI face classifier works. You can ask me about how the model detects fake images, what makes real photos different, or about our training performance and accuracy metrics.',
    };
  }
}

/**
 * Mock summary for development/testing
 */
export async function mockSummarizeText(text, context) {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    summary: `Based on the ${context || 'provided context'}: The analysis indicates the image classification system is performing within expected parameters. The confidence level suggests the model has identified clear distinguishing features that align with its training on the GenImage dataset.`,
  };
}

// Export mock functions as alternatives for development
export const mocks = {
  uploadImageAndPredict: mockUploadImageAndPredict,
  getMetrics: mockGetMetrics,
  sendChatMessage: mockSendChatMessage,
  summarizeText: mockSummarizeText,
};

// Default export for easy importing
export default {
  uploadImageAndPredict,
  summarizeText,
  sendChatMessage,
  getMetrics,
  checkHealth,
  mocks,
};