const iResp = require('../utils/response.interface.js')
const certificateService = require('../services/certificate.js')

const create = async (req, res) => {
  try {
    const data = req.body
    const username = data.username
    //   const args = [data.id, data.idPerusahaan, data.totalEmisi]
    const suhuStandar = '25'
    const rhStandar = '70'
    const koreksi = '95'
    const u95 = 'u95'

    const BKMGCertificate = {
      noSertifikat: data.noSertifikat,
      identitasAlat: {
        nomorSeri: data.identitasAlat.nomorSeri,
        namaAlat: data.identitasAlat.namaAlat,
        merkPabrik: data.identitasAlat.merkPabrik,
        tipe: data.identitasAlat.tipe,
        lain: data.identitasAlat.lain,
      },
      identitasLokasi: {
        nama: data.identitasLokasi.nama,
        alamat: data.identitasLokasi.alamat,
      },
      sensor: {
        nama: data.sensor.nama,
        alamat: data.sensor.alamat,
        tipe: data.sensor.tipe,
        noSeri: data.sensor.noSeri,
        kapasitas: data.sensor.kapasitas,
        graduasi: data.sensor.graduasi,
        tanggalKalibrasi: data.sensor.tanggalKalibrasi,
        tempatKalibrasi: data.sensor.tempatKalibrasi,
      },
      kondisiRuang: {
        suhu: data.kondisiRuang.nama,
        kelembaban: data.kondisiRuang.alamat,
      },
      hasilKalibrasi: {
        temperatur: {
          suhuStandar: suhuStandar,
          alatYangDikalibrasi: data.identitasAlat.namaAlat,
          koreksi: koreksi,
          u95: u95,
        },
        kelembabanUdara: {
          rhStandar: rhStandar,
          alatYangDikalibrasi: data.identitasAlat.namaAlat,
          koreksi: koreksi,
          u95: u95,
        },
      },
    }

    const result = await certificateService.create(
      username,
      JSON.stringify(BKMGCertificate)
    )

    res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send(iResp.buildErrorResponse(500, 'Something wrong', error))
  }
}

module.exports = { create }
