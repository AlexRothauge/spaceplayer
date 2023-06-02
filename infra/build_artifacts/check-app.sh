# This script will make sure the app is up and running when we need it
# will fail if the app is not reachable
wget -O - -T 2 "http://backend:4000/api"

while [ $? -ne 0 ]; do
    sleep 5
    wget -O - -T 2 "http://backend:4000/api"
done

wget -O - -T 2 "http://frontend:3000/"

while [ $? -ne 0 ]; do
    sleep 5
    wget -O - -T 2 "http://frontend:3000/"
done