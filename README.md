# MovieStreaming

A modern movie streaming platform built with Next.js, featuring a dynamic movie catalog with trailers, subscription plans, and user recommendations.

## Features

- **Movie Catalog:** Browse movies by genre with poster images and details
- **TMDB Integration:** Fetch movie posters, backdrop images, and trailers automatically
- **Movie Details:** View movie descriptions, ratings, duration, and watch trailers
- **Subscription Plans:** Multiple subscription tiers with different features and pricing
- **User Authentication:** Sign-in functionality for personalized experience
- **Responsive Design:** Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **External API:** TMDB (The Movie Database)
- **UI Components:** Shadcn UI

## Project Structure

```
/app                 # Next.js app router
/components          # UI components 
/api                 # API routes
  /mysql             # MySQL database endpoints
    /movies.ts       # Movie endpoints
    /subscriptions.ts# Subscription endpoints
    /recommendations.ts # Recommendation endpoints
  /tmdb.ts           # TMDB API integration
```

## Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- MySQL server
- TMDB API key

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```
TMDB_API_KEY=your_tmdb_api_key
```

2. Update the MySQL connection parameters in the API files if needed.

### Database Setup

1. Create a MySQL database named `MovieStreamingDB`
2. Set up the following tables:
   - Movies
   - Subscription
   - Users
   - Recommendation

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/MovieStreaming.git

# Navigate to the project directory
cd MovieStreaming

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Screenshots

![Movie Catalog](https://via.placeholder.com/800x400?text=Movie+Catalog)
![Movie Details](https://via.placeholder.com/800x400?text=Movie+Details)
![Subscription Plans](https://via.placeholder.com/800x400?text=Subscription+Plans)

## Future Enhancements

- Add watchlist functionality
- Implement search feature
- Add user ratings and reviews
- Enhanced recommendation algorithm
- Payment integration for subscriptions

## License

This project is licensed under the MIT License - see the LICENSE file for details.
