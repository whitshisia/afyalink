from fastapi import APIRouter
from .auth import router as auth_router
from .users import router as users_router
from .appointments import router as appointments_router
from .doctors import router as doctors_router
from .records import router as records_router
from .payments import router as payments_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(users_router)
router.include_router(appointments_router)
router.include_router(doctors_router)
router.include_router(records_router)
router.include_router(payments_router)