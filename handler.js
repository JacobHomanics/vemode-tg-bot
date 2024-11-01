'use strict';

const request = require('request');
const { createPublicClient, http, formatEther, parseAbiItem,  keccak256, toHex } = require('viem');
const { mode } = require('viem/chains');
const { contractABI } = require('./abi.js');
const axios = require('axios');


const chatId = "-1002346177126";

  const token = process.env.TELEGRAM_TOKEN;
  const BASE_URL = `https://api.telegram.org/bot${token}/sendMessage`;

  const client = createPublicClient({
    chain: mode,
    transport: http()
  });


  let lastBlock = null;

  module.exports.sendMessage = async () => {

    try {
      const currentBlock = await client.getBlockNumber();

      // Set the latest block number on the first run or check from the previous call
      if (!lastBlock) {
        lastBlock = currentBlock;
      }

      const filter = await client.createContractEventFilter({
        address: "0xff8AB822b8A853b01F9a9E9465321d6Fe77c9D2F",
        abi: contractABI,
        eventName: "Deposit",
        strict: true,
        fromBlock: lastBlock,
        toBlock: "latest"
    })

    // console.log(filter);

    const logs = await client.getFilterLogs({ filter });

    if (logs.length > 0) {
      console.log(logs);
      
        for (let i = 0; i < logs.length; i++) {


          const message = `${logs[i].args.depositor} deposited ${formatEther(logs[i].args.value)} tokens`;

        request.post(BASE_URL).form({
          text: message,
          chat_id: chatId
        });

        lastBlock = currentBlock;

        }
    } else {
      request.post(BASE_URL).form({
        text: "No new events detected!!!",
        chat_id: chatId
      });
    }

  } catch(error) {
    console.log(error);
  }
  };