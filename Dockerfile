FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Asia/Kolkata

RUN apt-get update
RUN apt-get upgrade -y

RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get install -y tzdata && \
    dpkg-reconfigure --frontend noninteractive tzdata

RUN apt-get install -y systemd systemd-sysv
RUN apt-get install -y build-essential
RUN apt-get install -y python3-pip 
RUN apt-get install -y libgdal-dev
RUN apt-get install -y imagemagick
RUN apt-get install -y xmlstarlet
RUN apt-get install -y gdal-bin 
RUN apt-get install -y python3
RUN apt-get install -y nodejs 
RUN apt-get install -y nano
RUN apt-get install -y wget
RUN apt-get install -y curl
RUN apt-get install -y npm

RUN apt-get install -y apache2
RUN apt-get install -y apache2-bin
RUN apt-get install -y apache2-utils
RUN apt-get install -y cgi-mapserver
RUN apt-get install -y mapserver-bin
RUN apt-get install -y mapserver-doc
RUN apt-get install -y libmapscript-perl
RUN apt-get install -y python3-mapscript
RUN apt-get install -y libapache2-mod-fcgid

RUN curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" |  tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org

RUN mkdir -p /home/mts/server
WORKDIR /home/mts/server

COPY . .
RUN chmod +x ./entryPoint.sh
RUN mv ./entryPoint.sh /entryPoint.sh
RUN mkdir userData

RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=18
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION && nvm alias default $NODE_VERSION
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN pip3 install toml wand
RUN pip3 install "GDAL<=$(gdal-config --version)"

EXPOSE 3000
EXPOSE 80

ENTRYPOINT ["/entryPoint.sh"]