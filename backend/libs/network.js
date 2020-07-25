const os = require('os')

// console.log(os.networkInterfaces())
const interfaces = os.networkInterfaces()

const network = Object.keys(interfaces).map(nic => {
  if (!interfaces[nic][0].internal) {
    return {
      address: interfaces[nic][0].address,
      netmask: interfaces[nic][0].netmask,
      mac: interfaces[nic][0].mac,
      cidr: interfaces[nic][0].cidr
    }
  }
}).filter(Boolean)[0]

module.exports = network
