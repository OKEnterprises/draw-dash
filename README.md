# Task Management System

A simple and intuitive task management application built with React and TypeScript.

## Features

- **Add Tasks**: Click the "Add New Task" button to create a new task card
- **Handwriting Detection**: Draw your task with handwriting and let AI recognize it!
  - Click the "Draw" button to switch to handwriting mode
  - Draw your task on the canvas with your mouse or touch screen
  - Click "Recognize" to convert your handwriting to text
  - Uses Tesseract.js for optical character recognition (OCR)
- **Update Status**:
  - Click "Pending" button (top right of card) to mark task as pending
  - Click "Done" button (bottom right of card) to mark task as complete
- **Filter Tasks**: Multi-select filter to show/hide tasks by status (To Do, Pending, Done)
- **Color-coded Cards**:
  - White: To Do
  - Yellow: Pending
  - Green: Done

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS3
- react-signature-canvas (for drawing interface)
- Tesseract.js (for OCR handwriting recognition)
