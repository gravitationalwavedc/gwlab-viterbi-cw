FROM nginx:latest

# Install needed packages
RUN apt-get update
RUN apt-get install -y curl git python3 python-virtualenv rsync

# Copy the viterbi source code in to the container
COPY src /src

# Pull down and set up the viterbi repo
RUN cd /tmp && git clone https://github.com/gravitationalwavedc/gwlab-viterbi-cw.git
WORKDIR /tmp/gwlab-viterbi-cw/src
RUN virtualenv -p python3 venv
RUN venv/bin/pip install -r requirements.txt
RUN mkdir -p logs
# Build the graphql schema from the viterbi repo
RUN venv/bin/python development-manage.py graphql_schema

# Copy the viterbi source in to the container
WORKDIR /

# Copy the generate viterbi schema
RUN mkdir -p /gwlab-viterbi-cw/src/react/data/
RUN mv /tmp/gwlab-viterbi-cw/src/react/data/schema.json /src/react/data/

# Don't need the viterbi project now
RUN rm -Rf /tmp/gwlab-viterbi-cw

# Build webpack bundle
RUN mkdir /src/static
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
RUN . ~/.nvm/nvm.sh && cd /src/react/ && nvm install && nvm use && nvm install-latest-npm && npm install && npm run relay && npm run build

# Copy the javascript bundle
RUN rsync -arv /src/static/ /static/

# Don't need any of the javascipt code now
RUN rm -Rf /src
RUN rm -Rf ~/.nvm/

RUN apt-get remove -y --purge python3 python-virtualenv rsync
RUN apt-get autoremove --purge -y

ADD ./nginx/static.conf /etc/nginx/conf.d/nginx.conf

EXPOSE 8000
