# Leaderboard Application

A real-time leaderboard application built with Next.js that displays the top 3 players and stores data in Google Sheets.

## Features

- 🏆 Beautiful UI displaying top 3 players with medals (Gold, Silver, Bronze)
- 🔄 Auto-refreshes every minute to fetch latest scores
- 📊 Google Sheets backend for data storage
- 🚀 Fast and responsive Next.js application
- 📱 Fully responsive design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend Storage**: Google Sheets API
- **API**: RESTful API endpoints

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ installed
- A Google Cloud Project with Google Sheets API enabled
- A Google Service Account with credentials

### 2. Google Sheets Setup

1. **Create a Google Cloud Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Sheets API**:

   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create Service Account**:

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
   - Click on the created service account
   - Go to "Keys" tab > "Add Key" > "Create new key"
   - Choose JSON format and download the file

4. **Create a Google Sheet**:

   - Create a new Google Sheet
   - Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Share the sheet with the service account email (found in the JSON file as `client_email`)
   - Give the service account "Editor" permissions

5. **Initialize the Sheet**:
   - The sheet should have columns: Name, Score, Timestamp
   - You can manually add headers or use the `/api/initialize` endpoint

### 3. Installation

```bash
# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_CREDENTIALS={"type":"service_account","project_id":"..."}
```

**Note**: Copy the entire content of your service account JSON file for `GOOGLE_CREDENTIALS`.

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### 1. Get Leaderboard (GET)

```
GET /api/leaderboard
```

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "name": "John Doe",
      "score": 1000,
      "timestamp": "2025-11-01T12:00:00.000Z"
    }
  ]
}
```

### 2. Add Entry (POST)

```
POST /api/leaderboard
Content-Type: application/json

{
  "name": "John Doe",
  "score": 1000
}
```

**Response**:

```json
{
  "success": true,
  "message": "Entry added successfully",
  "data": {
    "name": "John Doe",
    "score": 1000,
    "timestamp": "2025-11-01T12:00:00.000Z"
  }
}
```

### 3. Initialize Spreadsheet (GET)

```
GET /api/initialize
```

Initializes the Google Sheet with proper headers.

## Usage Examples

### Adding a Score via API

Using curl:

```bash
curl -X POST http://localhost:3000/api/leaderboard \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "score": 950}'
```

Using JavaScript:

```javascript
fetch("/api/leaderboard", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Alice",
    score: 950,
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

### Testing the Leaderboard

1. Visit `http://localhost:3000` to see the leaderboard UI
2. Use the POST API endpoint to add test entries
3. The leaderboard will auto-refresh every minute, or refresh the page manually

## Project Structure

```
leaderboard/
├── app/
│   ├── api/
│   │   ├── leaderboard/
│   │   │   └── route.ts          # GET & POST endpoints
│   │   └── initialize/
│   │       └── route.ts          # Initialize spreadsheet
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   └── Leaderboard.tsx           # Leaderboard component
├── lib/
│   └── google-sheets.ts          # Google Sheets utilities
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## Customization

### Change Refresh Interval

Edit `components/Leaderboard.tsx`:

```typescript
// Change 60000 (1 minute) to your desired interval in milliseconds
const interval = setInterval(fetchLeaderboard, 60000);
```

### Change Number of Top Players

Edit `lib/google-sheets.ts` in the `fetchLeaderboardData` function:

```typescript
// Change .slice(0, 3) to show more/fewer players
.slice(0, 3);
```

### Customize Styling

The application uses Tailwind CSS. Edit `components/Leaderboard.tsx` to customize colors, spacing, and animations.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Railway
- Render

## Troubleshooting

### "GOOGLE_CREDENTIALS environment variable is not set"

- Make sure `.env` file exists and contains valid `GOOGLE_CREDENTIALS`
- Ensure the JSON is properly formatted (no line breaks in the middle of the string)

### "Permission denied" error from Google Sheets

- Verify the service account email has Editor access to the sheet
- Check that the Google Sheets API is enabled in your Google Cloud Project

### Leaderboard not updating

- Check browser console for errors
- Verify the API endpoints are accessible
- Ensure the Google Sheet ID is correct

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
