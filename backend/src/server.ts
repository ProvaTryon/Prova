import dotenv from "dotenv";
import app from "@/app";
import { connectDB } from "@/config/connection.db";
import { warmRecommendationCache } from "@/services/recommendation.service";


dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // Warm recommendation cache on startup
  warmRecommendationCache().catch(err => {
    console.error('Cache warming failed:', err);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
