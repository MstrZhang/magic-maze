eval $(docker-machine env -u)
docker build -t itsmewiththeface/magicmaze-server:latest ../server && docker push itsmewiththeface/magicmaze-server:latest
docker build -t itsmewiththeface/magicmaze-client:latest ../client && docker push itsmewiththeface/magicmaze-client:latest


