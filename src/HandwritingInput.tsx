import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { createWorker } from 'tesseract.js';
import './HandwritingInput.css';

interface HandwritingInputProps {
  onRecognized: (text: string) => void;
  onCancel: () => void;
}

export default function HandwritingInput({ onRecognized, onCancel }: HandwritingInputProps) {
  const canvasRef = useRef<SignatureCanvas>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleRecognize = async () => {
    if (!canvasRef.current || canvasRef.current.isEmpty()) {
      alert('Please draw something first!');
      return;
    }

    setIsRecognizing(true);
    setProgress(0);

    try {
      // Get the canvas as a data URL
      const imageData = canvasRef.current.toDataURL('image/png');

      // Create Tesseract worker
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      // Perform OCR
      const { data: { text } } = await worker.recognize(imageData);

      // Cleanup
      await worker.terminate();

      // Return recognized text
      const trimmedText = text.trim();
      if (trimmedText) {
        onRecognized(trimmedText);
      } else {
        alert('Could not recognize any text. Please try writing more clearly.');
        setIsRecognizing(false);
      }
    } catch (error) {
      console.error('Error recognizing handwriting:', error);
      alert('An error occurred while recognizing handwriting. Please try again.');
      setIsRecognizing(false);
    }
  };

  return (
    <div className="handwriting-input">
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
