# 5 OR DIE

A no-nonsense 5-a-side football organiser. Stop texting about football. Start playing it.

## Features

- 🏃‍♂️ Create and join football games
- 💰 Track payments with zero faff
- 👕 Auto-assign & balance teams
- 📱 Mobile-first design
- 🔗 Share games with a single link
- 👑 Captain controls for managing games

## Tech Stack

- React + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Amazon S3 for data storage
- React Query for data management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# S3 Bucket for data storage (production)
VITE_S3_BUCKET_URL=https://your-bucket.s3.region.amazonaws.com/

# Leave empty to use localStorage for development
VITE_S3_BUCKET_URL=
```

## Storage Providers

The app supports multiple storage providers:

- `localStorage` for development
- Amazon S3 for production

Data is stored as JSON files with schema versioning for future migrations.

## Deployment

1. Set up an S3 bucket with the following configuration:

   - Public access enabled
   - CORS configured for your domain
   - Bucket policy allowing anonymous PUT/GET

2. Deploy to your hosting platform of choice:

```bash
npm run build
# Deploy the dist folder
```

## Contributing

This is a work in progress. Feel free to submit issues and PRs!

## FAQ

**Q: Why "5 OR DIE"?**  
A: Because this whole project is written primarily by Anthropic's Claude model - and I gave it full creative license to be its own person. It chose the name. Dramatic, I know.

**Q: So how much of this is actually written by you?**  
A: I wrote this line of the README. Isn't that enough? No? Fine. Just some glue code and cleanup here and there. The project was designed to understand how far you can get just supervising and supliying creative direction to today's models.

## License

MIT License - See LICENSE file for details

---

Made with ⚽️ for proper football
