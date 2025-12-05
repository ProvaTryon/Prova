import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import userRoutes from "@/routes/user.routes";
import authRoutes from "@/routes/auth.routes";
import productRoutes from "@/routes/product.routes";
import merchantRoutes from "@/routes/merchant.routes";
import orderRoutes from "@/routes/order.routes";
import branchRoutes from "@/routes/branch.routes";
import reviewRoutes from "@/routes/review.routes";
import recommendationRoutes from "@/routes/recommendation.routes";


import { logger } from "@/middleware/logger.middleware";
import { rateLimiter } from "@/middleware/rateLimit.middleware";
import { notFound } from "@/middleware/notFound.middleware";
import { errorHandler } from "@/middleware/error.middleware";

const app = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(rateLimiter);


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/merchants", merchantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use(notFound);
app.use(errorHandler);

export default app;