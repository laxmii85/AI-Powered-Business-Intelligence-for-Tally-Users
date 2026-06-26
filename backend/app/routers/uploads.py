from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.upload_service import UploadService

router = APIRouter()


@router.post("")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db)):
    return await UploadService(db).handle_upload(file)


@router.get("")
def list_uploads(db: Session = Depends(get_db)):
    return UploadService(db).list_uploads()


@router.get("/{upload_id}")
def get_upload(upload_id: int, db: Session = Depends(get_db)):
    return UploadService(db).get_upload(upload_id)
