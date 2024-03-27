'use strict'
const iResp = require('../utils/response.interface.js')
const fabric = require('../utils/fabric.js')
const create = async (user, args) => {
  const network = await fabric.connectToNetwork(
    'bmkgchannel',
    'certcontract',
    user
  )
  const result = await network.contract.submitTransaction('CreateCERT', ...args)
  network.gateway.disconnect()
  return result
}

module.exports = { create }
