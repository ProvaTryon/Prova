from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from .api import chatbot, recommender, tryon

app = FastAPI(title="Fashion Platform AI Services", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Fashion Platform AI Services"}

@app.get("/health")
async def health_check():
    return {"status": "OK", "service": "AI Backend"}

# Include API routers
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["chatbot"])
app.include_router(recommender.router, prefix="/api/recommend", tags=["recommender"])
app.include_router(tryon.router, prefix="/api/tryon", tags=["virtual-tryon"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
