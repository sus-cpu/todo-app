from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

# Title: trims spaces, must be 1-200 characters
Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]


class TaskCreate(BaseModel):
    title: Title


class TaskUpdate(BaseModel):
    completed: bool


class TaskOut(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)  # allows reading from SQLAlchemy objects
