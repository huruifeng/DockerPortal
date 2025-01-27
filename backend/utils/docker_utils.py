import json
import subprocess

def run_command(command):
    try:
        result = subprocess.check_output(command, stderr=subprocess.STDOUT, text=True)
        # result = subprocess.check_output(['ls', "/home/rh999"], stderr=subprocess.STDOUT, text=True)
        return result.strip()
    except subprocess.CalledProcessError as e:
        return str(e)

def run_command_shell(command_str:str):
    try:
        result = subprocess.run(command_str, shell=True, capture_output=True, check=True, text=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return str(e)

def list_images():
    # {"Containers":"N/A",
    # "CreatedAt":"2025-01-09 20:18:05 +0000 UTC",
    # "CreatedSince":"33 hours ago",
    # "Digest":"\u003cnone\u003e",
    # "ID":"3646d058bdd2",
    # "Repository":"donglab/ubuntu",
    # "SharedSize":"N/A","Size":"1.05GB",
    # "Tag":"latest",
    # "UniqueSize":"N/A",
    # "VirtualSize":"1.049GB"}

    # command = ["docker", "images", "--format", "{{.Repository}}:{{.Tag}}"]
    command = ["docker", "images", "--format", "json"]
    output = run_command(command).split("\n")
    # print(output)
    json_res = [json.loads(line) for line in output if line]
    # print(json_res)
    return json_res


def manage_image(image_id, action):
    command = ["docker", "image", action, image_id]
    return "Error" not in run_command(command)


def pull_image(image_name):
    command = ["docker", "pull", image_name]
    return "Downloaded" in run_command(command)


def push_image(image_name):
    ## login the hub
    cmd_str = "docker login -u donglab -p 426802@Yale"
    subprocess.run(cmd_str, shell=True)

    command = ["docker", "push", image_name]
    return "Downloaded" in run_command(command)

def run_container(container_name, image_id, use_gpu, password, ports_map, commands, mount_folder):
    port_80,port_443,port_22 = 0, 0, 0
    with open("/home/rh999/DockerPortal/ports.json") as f:
        ports = json.load(f)
        port_80 = int(ports["port_80"]) + 1
        port_443 = int(ports["port_443"]) + 1
        port_22 = int(ports["port_22"]) + 1

    if port_80 != 0:
        ports_map.append(f"{port_80}:80")
    if port_443 != 0:
        ports_map.append(f"{port_443}:443")
    if port_22 != 0:
        ports_map.append(f"{port_22}:22")

    ## save ports data
    ports["port_80"] = port_80
    ports["port_443"] = port_443
    ports["port_22"] = port_22
    with open("/home/rh999/DockerPortal/ports.json", "w") as f:
        json.dump(ports, f)

    ports_map = [p.strip() for p in ports_map]
    commands = ";".join([c.strip() for c in commands])
    mount_folder = [f.strip() for f in mount_folder]

    # print("1")

    command_ls = ["docker", "run", "-d", "-it", "--name", container_name]
    if use_gpu:
        command_ls += ["--gpus", "all"]
    # print("2")

    for port in ports_map:
        command_ls += ["-p", port]
    # print("3")

    for mount in mount_folder:
        command_ls += ["-v", mount]
    command_ls += ["-v", "/mnt/data:/mnt/data"]
    command_ls += [image_id]
    # print("4")

    if commands:
        commands = "'" + commands + "'"
        command_ls += ["/bin/bash", "-c", commands]
    # print("5")

    # print(" ".join(command_ls))
    output = run_command(command_ls).strip()
    # print("6")

    if "Error" in output:
        # print("7")
        return "Error in creating a container:" + output
    else:
        # print("8")
        # command_str = f"docker exec -d {container_name} mkdir -p /var/run/sshd"
        # run_command_shell(command_str)
        # print("9")

        command_str = f"docker exec -d {container_name} echo 'root:{password}' | chpasswd"
        run_command_shell(command_str)
        print("a")

        command_str = f"docker exec -d {container_name} sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config"
        # command_str = f"docker exec -d {container_name} sed -i '/^#/!s/PermitRootLogin .*/PermitRootLogin yes/' /etc/ssh/sshd_config"
        run_command_shell(command_str)
        print("b")

        # command_str = f"docker exec -d {container_name} sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd"
        # run_command_shell(command_str)

        # command_str = f"docker exec -d {container_name} /usr/sbin/sshd -D"
        command_str = f"docker exec -d {container_name} service ssh restart"
        run_command_shell(command_str)
        print("c")

        return "Container successfully created with id: " + output



def list_containers():
    # command = ["docker", "ps", "-a", "--format", "{{.ID}}|{{.Names}}|{{.Status}}"]
    command = ["docker", "ps", "-a", "--format", "json"]
    output = run_command(command).split("\n")
    # print(output)
    json_res = [json.loads(line) for line in output if line]
    # print(json_res)
    return json_res

def manage_container(container_id, action):
    command = ["docker", action, container_id]
    return "Error" not in run_command(command)
