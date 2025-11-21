# 📦 Install Required Dependencies

## Backend Dependencies

```bash
cd backend
npm install node-cron @types/node-cron date-fns
```

## Frontend Dependencies (Already Installed)

The following are already in your project:
- framer-motion
- react-hook-form
- date-fns
- lucide-react
- react-hot-toast

## Environment Variables

Add to `backend/.env`:
```env
# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Add to `frontend/.env`:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## Cloudinary Setup

1. Go to https://cloudinary.com and create a free account
2. Get your Cloud Name from the dashboard
3. Create an upload preset:
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set "Signing Mode" to "Unsigned"
   - Save the preset name

## Run the Application

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev
```

The reminder service will start automatically when the backend starts!
