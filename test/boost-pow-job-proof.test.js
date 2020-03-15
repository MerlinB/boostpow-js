'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowJob redeem work', () => {

   it('should success create hex ', async () => {
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '0000000000000000000000000000000000000000000000000000000000000006',
         minerPubKeyHash: '0000000000000000000000000000000000000001',
         extraNonce1: "00000002",
         extraNonce2: "0000000300000003",
         minerPubKey: '000000000000000000000000000000000000000000000000000000000000000006',
         time: '12300009',
         nonce: '00000005',
      });
      const jobObj = jobProof.toObject();
      expect(jobObj).to.eql({
         signature: '0000000000000000000000000000000000000000000000000000000000000006',
         minerPubKeyHash: '0000000000000000000000000000000000000001',
         extraNonce1: "00000002",
         extraNonce2: "0000000300000003",
         minerPubKey: '000000000000000000000000000000000000000000000000000000000000000006',
         time: '12300009',
         nonce: '00000005',
      });
      expect(jobProof.toHex()).to.eql('20000000000000000000000000000000000000000000000000000000000000000621000000000000000000000000000000000000000000000000000000000000000006040500000004090030120800000003000000030402000000140000000000000000000000000000000000000001');
      // expect(jobProof.toHex()).to.eql('200600000000000000000000000000000000000000000000000000000000000000200600000000000000000000000000000000000000000000000000000000000000080500000000000000040900301204030000000402000000140100000000000000000000000000000000000000');
      const fromHex = index.BoostPowJobProof.fromHex('20000000000000000000000000000000000000000000000000000000000000000621000000000000000000000000000000000000000000000000000000000000000006040500000004090030120800000003000000030402000000140000000000000000000000000000000000000001');
      const hexAgain = fromHex.toHex();
      expect(jobProof.toHex()).to.eql(hexAgain);
   });

   it('should success create asm and string', async () => {
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '0000000000000000000000000000000000000000000000000000000000000006',
         minerPubKeyHash: '0000000000000000000000000000000000000001',
         extraNonce1: "00000002",
         extraNonce2: "0000000300000003",
         minerPubKey: '000000000000000000000000000000000000000000000000000000000000000006',
         time: '12300009',
         nonce: '00000005',
      });

      const jobObj = jobProof.toObject();
      expect(jobObj).to.eql({
         signature: '0000000000000000000000000000000000000000000000000000000000000006',
         minerPubKeyHash: '0000000000000000000000000000000000000001',
         extraNonce1: "00000002",
         extraNonce2: "0000000300000003",
         minerPubKey: '000000000000000000000000000000000000000000000000000000000000000006',
         time: '12300009',
         nonce: '00000005',
      });

      expect(jobProof.toString()).to.eql('32 0x0000000000000000000000000000000000000000000000000000000000000006 33 0x000000000000000000000000000000000000000000000000000000000000000006 4 0x05000000 4 0x09003012 8 0x0000000300000003 4 0x02000000 20 0x0000000000000000000000000000000000000001');

      const fromString = index.BoostPowJobProof.fromString('32 0x0000000000000000000000000000000000000000000000000000000000000006 33 0x000000000000000000000000000000000000000000000000000000000000000006 4 0x05000000 4 0x09003012 8 0x0000000300000003 4 0x02000000 20 0x0000000000000000000000000000000000000001');

      expect(jobProof.toASM()).to.eql(fromString.toASM());

      expect(jobProof.toASM()).to.eql('0000000000000000000000000000000000000000000000000000000000000006 000000000000000000000000000000000000000000000000000000000000000006 05000000 09003012 0000000300000003 02000000 0000000000000000000000000000000000000001');
      expect(jobProof.toHex()).to.eql(index.BoostPowJobProof.fromASM(jobProof.toASM()).toHex());

   });

   it('should update nonce and time', async () => {
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '0000000000000000000000000000000000000000000000000000000000000001',
         minerPubKeyHash: '0000000000000000000000000000000000000000',
         extraNonce1: "00000000",
         extraNonce2: "0000000300000003",
         minerPubKey: '0000000000000000000000000000000000000000000000000000000000000001',
         time: '12300009',
         nonce: '10000002',
         minerPubKey: '0000000000000000000000000000000000000000000000000000000000000001',
      });

      // Important so we can create a mini cpu miner to just update the relevant sections quickly
      jobProof.setNonce('30000002');
      jobProof.setTime('12300009');

      expect(jobProof.toObject()).to.eql({
         signature: '0000000000000000000000000000000000000000000000000000000000000001',
         minerPubKeyHash: '0000000000000000000000000000000000000000',
         extraNonce1: "00000000",
         extraNonce2: "0000000300000003",
         minerPubKey: '010000000000000000000000000000000000000000000000000000000000000000',
         time: '12300009',
         nonce: '30000002',
      });

      expect(jobProof.toString()).to.eql('32 0x0000000000000000000000000000000000000000000000000000000000000001 33 0x010000000000000000000000000000000000000000000000000000000000000000 4 0x02000030 4 0x09003012 8 0x0000000300000003 4 0x00000000 20 0x0000000000000000000000000000000000000000');
   });

   it('should fail load job proof from transaction that is not a job proof', async () => {
      const jobProof = index.BoostPowJobProof.fromRawTransaction('0100000001c57af713fdd0750ea6556fef16ba58c6fd7946b6a6600163b84303a6047d2ab9010000006a4730440220302c22161af7d29186d420477b5f41329c470fadd43750944e094be69f39cab802204259cff79fb9a6b0947363ac6c9da6e607436f5c5acda931db0c908d3633ee71412102b618dda1256faf611127bbe9f213a00b74014740712fd2c4bac2647a9603e26effffffff0240420f0000000000d40831307674736f6f627504000000002074736f6f42206f6c6c654800000000000000000000000000000000000000000004ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88aca3055f0e000000001976a914ac04bc2ddd762c0fae2d2756f6d673899366cd3588ac00000000');
      expect(jobProof).to.eql(undefined);
   });

   it('should correctly get content and buffers as appropriate', async () => {
      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '0000000000000000000000000000000000000000000000000000000000000001',
         minerPubKeyHash: '0000000000000000000000000000000000000000',
         extraNonce1: "00000000",
         extraNonce2: "0000000300000003",
         minerPubKey: '0000000000000000000000000000000000000000000000000000000000000001',
         time: '12300009',
         nonce: '30000002',
         minerPubKey: '0000000000000000000000000000000000000000000000000000000000000001',
      });

      expect(jobProof.getTxid()).to.eql(undefined);
      expect(jobProof.getValue()).to.eql(undefined);
      expect(jobProof.getVout()).to.eql(undefined);
   });
});
