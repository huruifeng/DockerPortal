import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from backend.routes.docker_routes import router as docker_router

import subprocess

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:5173",  # React dev server
    "http://127.0.0.1:5173",  # Alternative localhost format
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow only specific origins
    allow_credentials=True, # Allow cookies and authentication headers
    allow_methods=["*"],    # Allow all HTTP methods
    allow_headers=["*"],    # Allow all headers
)

app.include_router(docker_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.websocket("/ws/pull_image")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        image_name = await websocket.receive_text()
        process = subprocess.Popen(
            ["docker", "pull", image_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        # Read the output line by line and send to the client
        while True:
            output = await asyncio.to_thread(process.stdout.readline)
            if output == '' and process.poll() is not None:
                break
            if output:
                await websocket.send_text(output.strip())

        # Close the process output
        process.stdout.close()
        await websocket.send_text("Pulling complete")

    except Exception as e:
        await websocket.send_text(f"Error: Something went wrong. {str(e)}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)