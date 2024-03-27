package chaincode

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type CERTContract struct {
	contractapi.Contract
}

// Asset describes basic details of what makes up a simple asset
// Insert struct field in alphabetic order => to achieve determinism across languages
// golang keeps the order when marshal to json but doesn't order automatically

// var logger = flogging.MustGetLogger("PEContract")

type BMKGCertificateResult struct {
	NoCertificate   string          `json:"noSertifikat"`
	IdentitasAlat   IdentitasAlat   `json:"identitasAlat"`
	IdentitasLokasi IdentitasLokasi `json:"identitasLokasi"`
	Sensor          Sensor          `json:"sensor"`
	KondisiRuang    KondisiRuang    `json:"kondisiRuang"`
	HasilKalibrasi  HasilKalibrasi  `json:"hasilKalibrasi"`
}

type IdentitasAlat struct {
	NomorSeri  string   `json:"nomorSeri"`
	NamaAlat   string   `json:"namaAlat"`
	MerkPabrik string   `json:"merkPabrik"`
	Tipe       string   `json:"tipe"`
	LainLain   []string `json:"lain"`
}
type IdentitasLokasi struct {
	Nama   string `json:"nama"`
	Alamat string `json:"alamat"`
}

type HasilKalibrasi struct {
	Temperatur      Temperatur      `json:"temperatur"`
	KelembabanUdara KelembabanUdara `json:"kelembabanUdara"`
}

type Sensor struct {
	NamaSensor       string `json:"nama"`
	MerkAlat         string `json:"alamat"`
	Tipe             string `json:"tipe"`
	NoSeri           string `json:"noSeri"`
	Kapasitas        string `json:"kapasitas"`
	Graduasi         string `json:"graduasi"`
	TanggalKalibrasi string `json:"tanggalKalibrasi"`
	TempatKalibrasi  string `json:"tempatKalibrasi"`
}

type KondisiRuang struct {
	Suhu       string `json:"suhu"`
	Kelembaban string `json:"kelembaban"`
}

type Temperatur struct {
	SuhuStandar         string `json:"suhuStandar"`
	AlatYangDikalibrasi string `json:"alatYangDikalibrasi"`
	Koreksi             string `json:"koreksi"`
	U95                 string `json:"u95"`
}

type KelembabanUdara struct {
	RHStandar           string `json:"rhStandar"`
	AlatYangDikalibrasi string `json:"alatYangDikalibrasi"`
	Koreksi             string `json:"koreksi"`
	U95                 string `json:"u95"`
}

// CreateAsset issues a new asset to the world state with given details.
func (s *CERTContract) CreateCERT(ctx contractapi.TransactionContextInterface, args string) error {

	var cert BMKGCertificateResult
	err := json.Unmarshal([]byte(args), &cert)
   
	if err != nil {
	 return fmt.Errorf("Failed to Unmarshal input JSON: %v", err)
	}
   
	certJSON, err := json.Marshal(cert)
	if err != nil {
	 return err
	}
   
	err = ctx.GetStub().PutState(cert.NoCertificate, certJSON)
	if err != nil {
	 fmt.Errorf(err.Error())
	}
   
	return err
   }
