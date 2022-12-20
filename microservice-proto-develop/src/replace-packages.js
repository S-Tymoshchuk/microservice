const fse = require('fs-extra')
const path = require('path')

async function main () {
  const gatewayFolderPath = path.join(__dirname, '../../clap-gateway')
  const protoFilePath = path.join(__dirname, '../../clap-proto/lib')
  const gatewayFolder = await fse.promises.opendir(gatewayFolderPath)
  for await (const folder of gatewayFolder) {
    if (!folder.isFile()) {
      fse.rmSync(path.join(gatewayFolderPath, folder.name, 'node_modules', 'clap-proto'), {
        recursive: true,
        force: true
      })
      let toFolder = path.join(gatewayFolderPath, 'node_modules', 'node_modules')
      try {
        let newPath = path.join(toFolder, 'clap-proto')

        fse.copySync(protoFilePath, newPath)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const microServices = ['clap-auth', 'clap-video', 'clap-gateway']

  const servicesFolderPath = path.join(__dirname, '../../')
  const servicesFolder = await fse.promises.opendir(servicesFolderPath)
  for await (const service of servicesFolder) {
    if (microServices.includes(service.name)) {
      if (!service.isFile()) {
        fse.rmSync(path.join(servicesFolderPath, service.name, 'node_modules', 'clap-proto'), {
          recursive: true,
          force: true
        })
        let toFolder = path.join(servicesFolderPath, service.name, 'node_modules')
        try {
          let newPath = path.join(toFolder, 'clap-proto')

          fse.copySync(protoFilePath, newPath)
        } catch (err) {
          console.log(err)
        }
      }
    }

  }
}

main()
