from pydantic import BaseModel
from typing import List, Optional

# Pydantic model to validate the incoming data
class RunContainerRequest(BaseModel):
    container_name: str
    password: str
    ports_map: Optional[List[str]] = []
    commands: Optional[List[str]] = []
    mount_folder: Optional[List[str]] = []
    use_gpu: bool
    image_id: str
