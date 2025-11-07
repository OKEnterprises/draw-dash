/**
 * Handwriting recognition service using Google Cloud Vision API
 * Docs: https://cloud.google.com/vision/docs/handwriting
 */

interface VisionApiResponse {
  responses: Array<{
    textAnnotations?: Array<{
      description: string;
      locale?: string;
    }>;
    fullTextAnnotation?: {
      text: string;
    };
    error?: {
      code: number;
      message: string;
    };
  }>;
}

export class HandwritingRecognitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HandwritingRecognitionError';
  }
}

/**
 * Recognizes handwritten text from an image using Google Cloud Vision API
 * @param imageDataUrl - Base64 encoded image data URL (e.g., from canvas.toDataURL())
 * @param onProgress - Optional callback for progress updates (0-100)
 * @returns Recognized text string
 */
export async function recognizeHandwriting(
  imageDataUrl: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;

  if (!apiKey) {
    throw new HandwritingRecognitionError(
      'Google Cloud Vision API key not configured. Please add VITE_GOOGLE_CLOUD_VISION_API_KEY to your .env file.'
    );
  }

  // Extract base64 data from data URL
  const base64Image = imageDataUrl.split(',')[1];

  if (!base64Image) {
    throw new HandwritingRecognitionError('Invalid image data');
  }

  onProgress?.(10);

  const requestBody = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'DOCUMENT_TEXT_DETECTION', // Best for handwriting
            maxResults: 1,
          },
        ],
      },
    ],
  };

  onProgress?.(30);

  try {
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    onProgress?.(70);

    if (!response.ok) {
      const errorData = await response.json();
      throw new HandwritingRecognitionError(
        errorData.error?.message || `API request failed with status ${response.status}`
      );
    }

    const data: VisionApiResponse = await response.json();

    onProgress?.(90);

    // Check for API errors
    if (data.responses[0]?.error) {
      throw new HandwritingRecognitionError(
        data.responses[0].error.message || 'API returned an error'
      );
    }

    // Extract text from response
    const text = data.responses[0]?.fullTextAnnotation?.text ||
                 data.responses[0]?.textAnnotations?.[0]?.description || '';

    onProgress?.(100);

    if (!text.trim()) {
      throw new HandwritingRecognitionError(
        'No text detected. Please try writing more clearly or with darker strokes.'
      );
    }

    return text.trim();
  } catch (error) {
    if (error instanceof HandwritingRecognitionError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new HandwritingRecognitionError(
        `Failed to recognize handwriting: ${error.message}`
      );
    }

    throw new HandwritingRecognitionError('An unknown error occurred');
  }
}
