# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from router import router
from database import engine, Base, SessionLocal
from queries import seed_initial_data_if_empty
import models  # noqa: F401

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Automatically create tables in test_db if they don't exist
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        seed_initial_data_if_empty(db)
        db.close()
        print("\n" + "="*60)
        print(">>> [SUCCESS] Connected to database: test_db (127.0.0.1:3306)")
        print(">>> [SUCCESS] Table 'employees' verified and ready for frontend!")
        print("="*60 + "\n")
    except Exception as e:
        print("\n" + "="*60)
        print(f">>> [WARNING] Database connection error: {e}")
        print("="*60 + "\n")
    yield

app = FastAPI(title="Employee Management API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

if __name__ == "__main__":
    # pyrefly: ignore [missing-import]
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)

