### DockerPortal Project Specification

#### Tech Stack
- **Frontend:** React
  - Use **Zustand** for status management.
  - Use **Axios** for cross-domain API communication.
- **Backend:** FastAPI
  - Utilize Python’s `subprocess` module to execute Docker commands.

---

#### Layout Design
1. **Index** (Left):
   - Navigation Menu with options:
     - **Images Management**
     - **Containers Management**
2. **Main Content Area** (Right):
   - Top Row: Display a title corresponding to the selected menu item.
   - Below the title row, display the specific content for the selected page.

---

#### Functional Requirements

##### **Images Management Page**
- **List Docker Images:**
  - Fetch and display a list of available Docker images on the server.
- **Pull Image from Docker Hub:**
  - Input field for the image name.
  - Button to pull the image.
  - Show success/failure messages.
- **Run Container from Image:**
  - Button next to each image to trigger container creation.
  - Navigate to a **create page** upon button click.
- **Create Page:**
  - Form fields for:
    - **Container Name**
    - **Use GPU:** Checkbox to enable/disable GPU.
    - **Set Password:** Input field for container password.
  - Button to confirm and start the container.

##### **Container Management Page**
- **List Containers:**
  - Show all containers with their status (running/stopped).
  - Display container details like ID, name, and status.
- **Control Containers:**
  - Buttons for each container to:
    - **Start**
    - **Stop**
    - **Remove**
- Update status dynamically upon user actions.

---

#### Backend (FastAPI)
- **Routes:**
  1. **Image Routes:**
     - GET `/images`: List all Docker images.
     - POST `/images/pull`: Pull an image from Docker Hub.
  2. **Container Routes:**
     - GET `/containers`: List all containers and their statuses.
     - POST `/containers/run`: Start a new container with given configuration.
     - POST `/containers/start`: Start a stopped container.
     - POST `/containers/stop`: Stop a running container.
     - DELETE `/containers`: Remove a container.
- **Subprocess Commands:**
  - Use `docker images` to fetch images.
  - Use `docker pull` to pull images.
  - Use `docker ps` and `docker ps -a` to fetch containers and their statuses.
  - Use `docker start`, `docker stop`, and `docker rm` for container control.
  - Use `docker run` with optional arguments for GPU and environment setup.

---

#### Additional Considerations
- **Authentication:**
  - Secure API endpoints with authentication (e.g., API tokens).
- **Error Handling:**
  - Handle errors from Docker commands and return meaningful responses to the frontend.
- **UI Enhancements:**
  - Add loading indicators for actions like pulling an image or starting a container.
  - Display confirmation dialogs for destructive actions like removing a container.

