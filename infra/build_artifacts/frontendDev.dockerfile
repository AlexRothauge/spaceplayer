FROM node:latest
# fix for chfn: PAM: System error which occured when, only in the pipeline the dockerfile was tryed to be built
# look here for more information: https://github.com/moby/moby/issues/6345
RUN ln -s -f /bin/true /usr/bin/chfn
# I need to change the group and user id of the default node user to 1001 so 1000 becomes free
# the reason for this is because i mustr use a user with the ids 1000:1000 for the ci pipeline to work
# using the node user didnt work for me because of a bug in npm where .npm is root owned or something
# so this was the easiest solution for me
RUN groupmod -g 1001 node \
  && usermod -u 1001 -g 1001 node

# set ENV variables for User, group and HOME dir
ENV USER_ID=1000
ENV GROUP_ID=1000
ENV USER=space
ENV HOME="/${USER}"

# everything using apt-get or curl or something you need special rights for should be done before the USER statement
RUN apt-get update

# add our user and group we are going to work with
RUN addgroup --gid ${GROUP_ID} ${USER}
RUN adduser --disabled-password --gecos '' --home "${HOME}" --uid "${USER_ID}" --gid "${GROUP_ID}" "${USER}"

USER ${USER}
WORKDIR ${HOME}

# Copy the application in the docker file system
COPY --chown=${USER_ID}:${GROUP_ID} ./packages/frontend ${HOME}/packages/frontend/
COPY --chown=${USER_ID}:${GROUP_ID} ./infra/env_vars/ ${HOME}/infra/env_vars/
COPY --chown=${USER_ID}:${GROUP_ID} ./infra/build_artifacts/dockerFrontend-entrypoint.sh ${HOME}/scripts/
COPY --chown=${USER_ID}:${GROUP_ID} ./infra/build_artifacts/check-mysql.sh ${HOME}/scripts/
#COPY --chown=${USER_ID}:${GROUP_ID} ./infra/build_artifacts/check-app.sh ${HOME}/scripts/
# run chmod so the entrypoint script is excecutable
RUN chmod +x ${HOME}/scripts/dockerFrontend-entrypoint.sh
RUN chmod +x ${HOME}/scripts/check-mysql.sh
#RUN chmod +x ${HOME}/scripts/check-app.sh

COPY --chown=${USER_ID}:${GROUP_ID} ./infra/env_vars/.env.example ${HOME}/infra/env_vars/.env

# install depencies and build the application
RUN /bin/bash -c 'cd ${HOME}/packages/frontend; npm ci; npm run build'

# Expose the port for frontend (3000)
EXPOSE 3000

# set entrypoint to a script i wrote
ENTRYPOINT ["./scripts/dockerFrontend-entrypoint.sh"]
