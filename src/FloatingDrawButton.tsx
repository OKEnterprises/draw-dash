import { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { recognizeHandwriting, HandwritingRecognitionError } from './services/handwritingRecognition';
import './FloatingDrawButton.css';

interface FloatingDrawButtonProps {
  onTaskCreated: (text: string) => void;
}

const INACTIVITY_DELAY = 3000; // 3 seconds of inactivity before auto-recognition

export default function FloatingDrawButton({ onTaskCreated }: FloatingDrawButtonProps) {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<SignatureCanvas>(null);
  const inactivityTimerRef = useRef<number | null>(null);
  const hasDrawnRef = useRef(false);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  const handleOpenCanvas = () => {
    setIsCanvasOpen(true);
    setError(null);
    hasDrawnRef.current = false;
  };

  const handleCloseCanvas = () => {
    setIsCanvasOpen(false);
    setIsRecognizing(false);
    setProgress(0);
    setError(null);
    hasDrawnRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  const handleRecognize = async () => {
    if (!canvasRef.current || canvasRef.current.isEmpty()) {
      setError('Please draw something first!');
      return;
    }

    setIsRecognizing(true);
    setProgress(0);
    setError(null);

    try {
      const imageData = canvasRef.current.toDataURL('image/png');
      const text = await recognizeHandwriting(imageData, (p) => setProgress(p));

      // Create the task
      onTaskCreated(text);

      // Close the canvas
      handleCloseCanvas();
    } catch (error) {
      console.error('Error recognizing handwriting:', error);

      if (error instanceof HandwritingRecognitionError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }

      setIsRecognizing(false);
    }
  };

  const handleDrawing = () => {
    hasDrawnRef.current = true;

    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer for auto-recognition
    inactivityTimerRef.current = window.setTimeout(() => {
      if (hasDrawnRef.current && !isRecognizing) {
        handleRecognize();
      }
    }, INACTIVITY_DELAY);
  };

  return (
    <>
      {/* Floating button */}
      {!isCanvasOpen && (
        <button
          className="floating-draw-button"
          onClick={handleOpenCanvas}
          title="Draw to create task"
        >
          ✏️
        </button>
      )}

      {/* Full-screen canvas overlay */}
      {isCanvasOpen && (
        <div className="floating-draw-overlay">
          <div className="floating-draw-overlay__header">
            <h2>Draw your task</h2>
            <p>Stop drawing for a moment and your text will be recognized automatically</p>
            <button
              className="floating-draw-overlay__close"
              onClick={handleCloseCanvas}
              disabled={isRecognizing}
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="floating-draw-overlay__error">
              {error}
            </div>
          )}

          <div className="floating-draw-overlay__canvas-container">
            <SignatureCanvas
              ref={canvasRef}
              canvasProps={{
                className: 'floating-draw-overlay__canvas',
              }}
              backgroundColor="rgba(255, 255, 255, 0.85)"
              penColor="black"
              onEnd={handleDrawing}
            />
            {isRecognizing && (
              <div className="floating-draw-overlay__recognizing">
                <div className="floating-draw-overlay__spinner"></div>
                <p>Recognizing handwriting... {progress}%</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
