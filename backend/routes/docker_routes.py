from fastapi import APIRouter, HTTPException

from backend.model.Container import RunContainerRequest
from backend.utils.docker_utils import *

router = APIRouter()


@router.get("/images")
async def get_images():
    return {"images": list_images()}

@router.post("/image/{action}")
async def operate_image(action: str, image_id: str):
    print(f"Action: {action}, Image ID: {image_id}")
    if action in {"start", "stop", "remove"}:
        if manage_image(image_id, action):
            return {"success": "success", "message": f"Container {action}ed successfully."}
        else:
            return {"success": "error", "message": f"Container {action} failed."}
    else:
        return {"success": "error", "message": f"Action {action} is not supported."}

@router.post("/imagepull")
async def pull_docker_image(image_name: str):
    if pull_image(image_name):
        return {"success":True, "message": f"Image '{image_name}' pulled successfully."}
    else:
        return {"success":False, "message": f"Image '{image_name}' not found."}


@router.post("/imagepush")
async def push_docker_image(image_name: str):
    if push_image(image_name):
        return {"success":True, "message": f"Image '{image_name}' pulled successfully."}
    else:
        return {"success":False, "message": f"Image '{image_name}' not found."}

@router.post("/imagerun")
async def create_docker_container(request: RunContainerRequest):
    print("Creating container with data:",request.dict)
    container_name = request.container_name
    password = request.password
    ports_map = request.ports_map
    command = request.commands
    mount_folder = request.mount_folder
    use_gpu = request.use_gpu
    image_id = request.image_id  # Use the image ID to pull or use the image

    res = run_container(container_name, image_id, use_gpu, password, ports_map, command, mount_folder)

    if "Error" in res:
        return {"success":False, "message": res}
    else:
        return {"success": True, "message": res}


@router.get("/containers")
async def get_containers():
    return {"containers": list_containers()}


@router.post("/container/{action}")
async def operate_container(action: str, container_id: str):
    if action in {"start", "stop", "remove"}:
        if manage_container(container_id, action):
            return {"message": f"Container {action}ed successfully."}
        else:
            return {"message": f"Error: Container {action} failed."}
    else:
        return {"message": f"Error: Action {action} is not supported."}

@router.get("/containercommit")
async def commit_container():
    return {"message": "Container commit successfully."}