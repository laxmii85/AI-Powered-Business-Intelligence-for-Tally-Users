import re
from io import BytesIO
from fastapi import HTTPException, UploadFile
import pandas as pd
from sqlalchemy.orm import Session
from ..models import DatasetMetadata, Upload, UploadedData
from .metadata_generator import MetadataGenerator
from .schema_detector import SchemaDetector


class UploadService:
    def __init__(self, db: Session):
        self.db = db

    async def handle_upload(self, file: UploadFile) -> dict:
        if not file.filename:
            raise HTTPException(400, "Missing file name")
        extension = file.filename.rsplit(".", 1)[-1].lower()
        if extension not in {"csv", "xlsx", "xls"}:
            raise HTTPException(400, "Only CSV and Excel files are supported")

        content = await file.read()
        df = self._read_dataframe(extension, content)
        if df.empty:
            raise HTTPException(400, "Uploaded dataset is empty")

        df = self._clean(df)
        schema = SchemaDetector().detect(df)
        metadata = MetadataGenerator().generate(df, schema)
        upload = Upload(
            file_name=file.filename,
            table_name=self._table_name(file.filename),
            dataset_type=self._dataset_type(schema),
            total_rows=len(df),
            total_columns=len(df.columns),
        )
        self.db.add(upload)
        self.db.flush()
        self.db.add(DatasetMetadata(upload_id=upload.id, **metadata))
        self.db.bulk_save_objects(
            [UploadedData(upload_id=upload.id, row_index=i, payload=row) for i, row in enumerate(df.to_dict("records"))]
        )
        self.db.commit()
        return self.get_upload(upload.id)

    def list_uploads(self) -> list[dict]:
        uploads = self.db.query(Upload).order_by(Upload.uploaded_at.desc()).all()
        return [self._serialize_upload(upload) for upload in uploads]

    def get_upload(self, upload_id: int) -> dict:
        upload = self.db.get(Upload, upload_id)
        if not upload:
            raise HTTPException(404, "Dataset not found")
        data = self._serialize_upload(upload)
        data["metadata"] = upload.metadata_record.schema if upload.metadata_record else {}
        data["suggestions"] = upload.metadata_record.suggestions if upload.metadata_record else []
        return data

    def _read_dataframe(self, extension: str, content: bytes) -> pd.DataFrame:
        try:
            if extension == "csv":
                return pd.read_csv(BytesIO(content))
            return pd.read_excel(BytesIO(content))
        except Exception as exc:
            raise HTTPException(400, f"Unable to read file: {exc}") from exc

    def _clean(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df.columns = [str(col).strip() for col in df.columns]
        df = df.where(pd.notnull(df), None)
        for column in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[column]):
                df[column] = df[column].dt.strftime("%Y-%m-%d")
        return df

    def _table_name(self, filename: str) -> str:
        base = re.sub(r"[^a-zA-Z0-9]+", "_", filename.rsplit(".", 1)[0]).strip("_").lower()
        base_name = f"dataset_{base or 'upload'}"
        name = base_name
        counter = 1
        while self.db.query(Upload).filter_by(table_name=name).first():
            name = f"{base_name}_{counter}"
            counter += 1
        return name

    def _dataset_type(self, schema: dict) -> str:
        roles = schema.get("roles", {})
        if roles.get("invoice"):
            return "Invoices"
        if roles.get("gst"):
            return "GST Accounting"
        if roles.get("product"):
            return "Sales Ledger"
        return "Accounting"

    def _serialize_upload(self, upload: Upload) -> dict:
        return {
            "id": upload.id,
            "file_name": upload.file_name,
            "table_name": upload.table_name,
            "dataset_type": upload.dataset_type,
            "total_rows": upload.total_rows,
            "total_columns": upload.total_columns,
            "uploaded_at": upload.uploaded_at.isoformat(),
        }
