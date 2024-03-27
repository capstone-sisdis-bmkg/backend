'use strict'
const iResp = require('../utils/response.interface.js')

const FabricCAServices = require('fabric-ca-client')
const fabric = require('../utils/fabric.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const enrollAdmin = async (adminId, adminSecret, organizationName) => {
  const ccp = await fabric.getCcp(organizationName)

  // Create a new CA client for interacting with the CA.
  const caInfo =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ]
  const caTLSCACerts = caInfo.tlsCACerts.pem

  const ca = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.causername
  )

  const wallet = await fabric.getWallet(organizationName)

  // Check to see if we've already enrolled the admin user.
  const identity = await wallet.get(adminId)
  if (identity) {
    throw new Error(
      'An identity for the admin user "admin" already exists in the wallet'
    )
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({
    enrollmentID: adminId,
    enrollmentSecret: adminSecret,
  })

  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `${organizationName}MSP`,
    type: 'X.509',
  }
  await wallet.put(adminId, x509Identity)

  const response = {
    success: true,
    message: 'Successfully registered admin and imported it into the wallet',
  }
  return response
}

const registerAdminBMKG = async (
  username,
  email,
  organizationName = 'bmkg',
  userType
) => {
  await createUser(username, email, organizationName, userType)

  const payload = {
    id: uuidv4(),
    username: username,
    email: email,
    userType: userType,
  }
  const token = jwt.sign(payload, 'secret_key', { expiresIn: '2h' })
  payload.token = token

  return iResp.buildSuccessResponse(
    200,
    'Successfully registered admin BMKG and imported it into the wallet',
    payload
  )
}

const loginUser = async (username, password) => {
  const organizationName = 'bmkg'
  const walletBMKG = await fabric.getWallet(organizationName)

  const user = await walletBMKG.get(username)

  if (!user) {
    throw new Error(`User ${username} is not registered yet`)
  }

  // Get user attr
  const userAttrs = await fabric.getUserAttrs(username, organizationName)
  const userPassword = userAttrs.find((e) => e.name == 'password').value
  const userType = userAttrs.find((e) => e.name == 'userType').value

  // Compare input password with password in CA
  if (await bcrypt.compare(password, userPassword)) {
    const payload = {
      username: username,
      userType: userType,
    }
    const token = jwt.sign(payload, 'secret_key', { expiresIn: '2h' })

    // kurang id sama email, nanti tarik dulu dari cc
    payload.token = token
  } else {
    throw new Error('Invalid credentials')
  }

  return iResp.buildSuccessResponse(200, `Successfully Login`, payload)
}

module.exports = {
  enrollAdmin,
  registerAdminBMKG,
  loginUser,
}

const createUser = async (username, email, organizationName, userType) => {
  const ccp = await fabric.getCcp(organizationName)

  // Create a new CA client for interacting with the CA.
  const caURL =
    ccp.certificateAuthorities[
      `ca.${organizationName.toLowerCase()}.example.com`
    ].url
  const ca = new FabricCAServices(caURL)

  const wallet = await fabric.getWallet(organizationName)

  // Check to see if we've already enrolled the admin user.
  const adminIdentity = await wallet.get('admin')
  if (!adminIdentity) {
    throw new Error('Admin network does not exist')
  }

  // build a user object for authenticating with the CA
  const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type)
  const adminUser = await provider.getUserContext(adminIdentity, 'admin')

  // Create random password end encrypted
  const password = crypto.randomBytes(4).toString('hex')
  const encryptedPassword = await bcrypt.hash(password, 10)

  // Register the user, enroll the user, and import the new identity into the wallet.
  const secret = await ca.register(
    {
      affiliation: `${organizationName.toLowerCase()}.department1`,
      enrollmentID: username,
      role: 'client',
      attrs: [
        { name: 'userType', value: userType, ecert: true },
        { name: 'password', value: encryptedPassword, ecert: true },
      ],
    },
    adminUser
  )

  const enrollment = await ca.enroll({
    enrollmentID: username,
    enrollmentSecret: secret,
    attr_reqs: [
      { name: 'userType', optional: false },
      { name: 'password', optional: false },
    ],
  })

  const x509Identity = {
    credentials: {
      certificate: enrollment.certificate,
      privateKey: enrollment.key.toBytes(),
    },
    mspId: `${organizationName}MSP`,
    type: 'X.509',
  }
  await wallet.put(username, x509Identity)

  fs.writeFile(
    path.join(process.cwd(), 'wallet', 'user.txt'),
    `${username}~${userType}~${password}\n`,
    { flag: 'a+' },
    (err) => {}
  )
}
