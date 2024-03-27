#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGCAP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=bmkg
ORGCAP=BMKG
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/bmkg.example.com/tlsca/tlsca.bmkg.example.com-cert.pem
CAPEM=organizations/peerOrganizations/bmkg.example.com/ca/ca.bmkg.example.com-cert.pem

echo "$(json_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/bmkg.example.com/connection-bmkg.json
echo "$(yaml_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/bmkg.example.com/connection-bmkg.yaml

# ORG=supplychain
# ORGCAP=SupplyChain
# P0PORT=9051
# CAPORT=8054
# PEERPEM=organizations/peerOrganizations/supplychain.example.com/tlsca/tlsca.supplychain.example.com-cert.pem
# CAPEM=organizations/peerOrganizations/supplychain.example.com/ca/ca.supplychain.example.com-cert.pem

# echo "$(json_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/supplychain.example.com/connection-supplychain.json
# echo "$(yaml_ccp $ORG $ORGCAP $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/supplychain.example.com/connection-supplychain.yaml