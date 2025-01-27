Docker commands
#############################################################
Image
docker pull [ubuntu:tag]
docker image ls / docker images
docker image rm / docker rmi [image:tag]b
------
docker commit [c_name] [image:tag]
docker login -u donglab -p 426802@Yale

docker image tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]
docker image push [OPTIONS] NAME[:TAG]

========================
Container
docker rm -f c_ID / docker container rm c_ID
docker ps -a / docker container ls
------
docker run = docker creater + docker start

docker container attach [OPTIONS] CONTAINER ## enter the container
docker run -v /host/path:/container/path <image> ## Mount folder

docker run --gpus all -it -v /mnt/data:/mnt/data --name ubuntu0424 donglab/ubuntu /bin/bash

##################################################

docker run -d -p 8080:8080 -p 8022:22 -p 80:80 \
    --name 'biopipes' hrflove99/biopipes \
     /bin/bash -c 'service mysql start;airflow webserver --port 8080;airflow scheduler;'

###############################################
## Run docker exec on a running container
# First, start a container.
docker run -d -p 8080:8080 -p 8022:22 -p 80:80 --name 'biopipes' -it hrflove99/biopipes /bin/bash

# Next, execute a command on the container.
docker exec -d biopipes service ssh start
docker exec -d biopipes service apache2 start
docker exec -d biopipes service mysql start


# Next, execute an interactive bash shell on the container.
# This starts a new shell session in the container mycontainer.
docker exec -it biopipes bash

