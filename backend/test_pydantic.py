from pydantic import BaseModel, Field, model_validator
import pydantic
print(pydantic.__version__)

class ScanListResponse(BaseModel):
    items: list[int]
    total_items: int
    limit: int
    scans: list[int] = Field(default_factory=list)
    total: int = 0
    page_size: int = 10

    @model_validator(mode="before")
    @classmethod
    def populate_compat_fields(cls, data):
        if isinstance(data, dict):
            # Create a copy to avoid mutating the original kwargs
            d = dict(data)
            if "items" in d and d.get("scans") is None:
                d["scans"] = d["items"]
            if "total_items" in d and d.get("total") is None:
                d["total"] = d["total_items"]
            if "limit" in d and d.get("page_size") is None:
                d["page_size"] = d["limit"]
            return d
        return data

data = {"items": [], "total_items": 42, "limit": 10}
resp = ScanListResponse(**data)
print(resp.model_dump())
