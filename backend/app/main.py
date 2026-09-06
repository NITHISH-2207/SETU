from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine
import app.models  # noqa: F401 - Register all models with Base

# Initialize database tables
Base.metadata.create_all(bind=engine)

from app.api.routes.auth import router as auth_router
from app.api.routes.citizen import router as citizen_router
from app.api.routes.government import router as government_router
from app.api.routes.university import router as university_router
from app.api.routes.csr import router as csr_router
from app.api.routes.project import router as project_router
from app.api.routes.notification import router as notification_router

app = FastAPI(
    title="SETU Backend",
    description="Authoritative Backend API for the SETU Platform (Citizen, Government, University, CSR/Industry)",
    version="1.0.0",
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "SETU backend is running!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


app.include_router(auth_router)
app.include_router(citizen_router)
app.include_router(government_router)
app.include_router(university_router)
app.include_router(csr_router)
app.include_router(project_router)
app.include_router(notification_router)