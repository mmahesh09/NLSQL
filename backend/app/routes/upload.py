from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import ColumnInfo, UploadResponse
from app.services.file_parser import get_schema_info, parse_file, store_dataframe

router = APIRouter()

ALLOWED_EXTENSIONS = {"csv", "xlsx", "xls", "json"}


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}")

    content = await file.read()
    try:
        df = parse_file(content, file.filename or "upload")
    except Exception as e:
        raise HTTPException(400, f"Failed to parse file: {e}")

    session_id = store_dataframe(df)
    schema = get_schema_info(df)
    preview = df.head(5).astype(object).fillna("").to_dict(orient="records")

    return UploadResponse(
        session_id=session_id,
        filename=file.filename or "upload",
        columns=[ColumnInfo(**col) for col in schema],
        row_count=len(df),
        preview=preview,
    )
