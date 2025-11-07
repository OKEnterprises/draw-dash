import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { recognizeHandwriting, HandwritingRecognitionError } from './services/handwritingRecognition';
import './HandwritingInput.css';

interface HandwritingInputProps {
  onRecognized: (text: string) => void;
  onCancel: () => void;
}

export default function HandwritingInput({ onRecognized, onCancel }: HandwritingInputProps) {
  const canvasRef = useRef<SignatureCanvas>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
    setError(null);
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
      // Get the canvas as a data URL
      const imageData = canvasRef.current.toDataURL('image/png');

      // Use Google Cloud Vision API for handwriting recognition
      const text = await recognizeHandwriting(imageData, (p) => setProgress(p));

      // Return recognized text
      onRecognized(text);
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

  return (
    <div className="handwriting-input">
      {error && (
        <div className="handwriting-input__error">
          {error}
        </div>
      )}
      <div className="handwriting-input__canvas-container">
        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{
            className: 'handwriting-input__canvas',
          }}
          backgroundColor="white"
          penColor="black"
        />
        {isRecognizing && (
          <div className="handwriting-input__overlay">
            <div className="handwriting-input__progress">
              <div className="handwriting-input__spinner"></div>
              <p>Recognizing handwriting... {progress}%</p>
            </div>
          </div>
        )}
      </div>
      <div className="handwriting-input__actions">
        <button
          className="handwriting-input__action-button handwriting-input__action-button--recognize"
          onClick={handleRecognize}
          disabled={isRecognizing}
        >
          {isRecognizing ? 'Recognizing...' : 'Recognize'}
        </button>
        <button
          className="handwriting-input__action-button handwriting-input__action-button--clear"
          onClick={handleClear}
          disabled={isRecognizing}
        >
          Clear
        </button>
        <button
          className="handwriting-input__action-button handwriting-input__action-button--cancel"
          onClick={onCancel}
          disabled={isRecognizing}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
