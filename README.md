# Task Management System

A simple and intuitive task management application built with React and TypeScript.

## Features

- **Add Tasks**: Click the "Add New Task" button to create a new task card
- **Handwriting Detection**: Draw your task with handwriting and let AI recognize it!
  - Click the "Draw" button to switch to handwriting mode
  - Draw your task on the canvas with your mouse or touch screen
  - Click "Recognize" to convert your handwriting to text
  - Uses Google Cloud Vision API for accurate handwriting recognition
  - Supports cursive, print, and mixed handwriting styles
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

### Configuration

To use the handwriting detection feature, you need a Google Cloud Vision API key:

1. **Get an API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Cloud Vision API
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and add your API key:
     ```
     VITE_GOOGLE_CLOUD_VISION_API_KEY=your_api_key_here
     ```

**Note:** The free tier includes 1,000 requests per month, which is more than enough for personal use!

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
- Google Cloud Vision API (for handwriting recognition)
