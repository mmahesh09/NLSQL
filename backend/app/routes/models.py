from fastapi import APIRouter
from app.services.models import MODELS

router = APIRouter()


@router.get("/models")
def list_models():
    return MODELS
