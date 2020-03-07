'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('boost #BoostPowJob create various getters and setters', () => {

   it('should be valid minimal', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: Buffer.from('00000000000000000000000000000000000000000068656c6c6f20776f726c64', 'hex').toString('hex'),
         diff: 157416.40184364,
         category: "00000000",
         tag: '0000000000000000000000000000000000000000',
         metadata: "0000000000000000000000000000000000000000000000000000000000000000",
         unique: "0000000000000000",
      })
   });

   it('should be valid full', async () => {
      const job = index.BoostPowJob.fromObject({
         content: 'hello world',
         diff: 157416.40184364,
         // Optional fields below
         category: '04d2',
         tag: 'animals',
         metadata: 'metadata here',
         // Optional and auto-generated
         unique: '00000000913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('metadata here', 32).reverse().toString('hex'),
         unique: '00000000913914e3',
      });

      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });
   });

   it('should be valid full from object with hex fields', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const jobObj = job.toObject();
      expect(jobObj).to.eql({
         content: index.BoostUtilsHelper.createBufferAndPad('hello world', 32).reverse().toString('hex'),
         diff: 157416.40184364,
         category: '000004d2',
         tag: index.BoostUtilsHelper.createBufferAndPad('animals', 20).reverse().toString('hex'),
         metadata: index.BoostUtilsHelper.createBufferAndPad('metadata here', 32).reverse().toString('hex'),
         unique: '00000000913914e3',
      });

      expect(jobObj).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '000004d2',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });
   });

   it('should generate output script Hex', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toHex();
      expect(outputScript).to.eql('043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000008e314399100000000206572656820617461646174656d000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');
      const jobFromHex = index.BoostPowJob.fromHex(outputScript);

      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('043201000020646c726f77206f6c6c656800000000000000000000000000000000000000000004b3936a1a14736c616d696e610000000000000000000000000008e314399100000000206572656820617461646174656d000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88ac');
   });


   it('should generate output script toString', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '0132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should generate output script ASM', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      // Why the HECK does toString() work for fromASM, but toASM into fromASM does not?? Argghhh! bsv.js!
      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromASM(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '00000000000000000000000000000000000000000068656c6c6f20776f726c64',
         diff: 157416.40184364,
         category: '00000132',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(outputScript).to.eql('4 0x32010000 32 0x646c726f77206f6c6c6568000000000000000000000000000000000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');

      expect(job.toASM()).to.eql('32010000 646c726f77206f6c6c6568000000000000000000000000000000000000000000 b3936a1a 736c616d696e6100000000000000000000000000 e314399100000000 6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');

   });

   it('should generate same formatted bits as bitcoin block 0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      const outputScript = job.toString();
      const jobFromHex = index.BoostPowJob.fromString(outputScript);
      expect(jobFromHex.toObject()).to.eql(job.toObject());

      expect(jobFromHex.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });

      expect(job.toObject()).to.eql({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '000000000000000000000000000000000000006d657461646174612068657265',
         unique: '00000000913914e3',
      });


      expect(outputScript).to.eql('4 0x01000000 32 0x9500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b000000000000 4 0xb3936a1a 20 0x736c616d696e6100000000000000000000000000 8 0xe314399100000000 32 0x6572656820617461646174656d00000000000000000000000000000000000000 OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT OP_4 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY OP_DUP 1 0x20 OP_LESSTHANOREQUAL OP_VERIFY OP_TOALTSTACK 29 0x0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT OP_TOALTSTACK OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_4 OP_SPLIT OP_TOALTSTACK OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256 OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG');
   });

   it('should return error for too large and invalid values. content', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '330000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 157416.40184364,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: content too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. diff', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: null,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: diff must be a number starting at 1. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. category', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '2300000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: category too large. Max 4 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. tag', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '3200000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: tag too large. Max 20 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
   it('should return error for too large and invalid values. metadata', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '33000000000000000000000000000000000000006d657461646174612068657265',
            unique: '00000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: metadata too large. Max 32 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });

   it('should return error for too large and invalid values. unique', async () => {
      try {
         index.BoostPowJob.fromObject({
            content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
            diff: 1,
            category: '00000001',
            tag: '00000000000000000000000000616e696d616c73',
            metadata: '000000000000000000000000000000000000006d657461646174612068657265',
            unique: '3300000000913914e3',
         });
      } catch (ex) {
         expect(ex.toString()).to.equal('Error: unique too large. Max 8 bytes.');
         return;
      }
      expect(true).to.eql(false);
   });
});


describe('boost #BoostPowString tryValidateJobProof', () => {

   it('tryValidateJobProof failure with sample data', async () => {
      const job = index.BoostPowJob.fromObject({
         content: '0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095',
         diff: 157416.40184364,
         category: '00000001',
         tag: '00000000000000000000000000616e696d616c73',
         metadata: '0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c',
         unique: '00000000913914e3',
      });

      const jobProof = index.BoostPowJobProof.fromObject({
         signature: '00',
         minerPubKey: '00',
         time: '4dcbc8a6',
         minerNonce: '00000000913914e3',
         minerAddress: '00',
      });

      const result = index.BoostPowJob.tryValidateJobProof(job, jobProof);

      expect(result).to.eql(null);
   });

});
