cd network

./network.sh up -ca -s couchdb

sleep 5

./network.sh createChannel

sleep 5

# ./network.sh deployCC -ccn basic -ccp ../chaincode/atcontract -ccl go
./network.sh deployCC -ccn certcontract -ccp ../chaincode/certcontract -ccl go
