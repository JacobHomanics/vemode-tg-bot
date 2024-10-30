'use strict';

const request = require('request');
const { createPublicClient, http, formatEther, parseAbiItem,  keccak256, toHex } = require('viem');
const { mode } = require('viem/chains');
const { contractABI } = require('./abi.js');
const axios = require('axios');


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
          chat_id: 1427698642
        });

        lastBlock = currentBlock;

        }
    } else {
      request.post(BASE_URL).form({
        text: "No new events detected!!!",
        chat_id: 1427698642
      });
    }

  } catch(error) {
    console.log(error);
  }
  };


// module.exports.listenForEvents = async () => {

//   request.post(BASE_URL).form({ text: "This is a polled event", chat_id: 1427698642 });

//   // const response = {
//   //   statusCode: 200,
//   //   body: JSON.stringify({
      
//   //   }),
//   // };

//   // return callback(null, response);

//   // try {
//   //   // Set the latest block number on the first run or check from the previous call
//   //   if (!latestBlock) {
//   //     latestBlock = await web3.eth.getBlockNumber();
//   //   }

//   //   // Fetch events from the latest block to the current one
//   //   const events = await contract.getPastEvents('YourEventName', {
//   //     fromBlock: latestBlock,
//   //     toBlock: 'latest',
//   //   });

//   //   // Process each event and send it to Telegram
//   //   events.forEach(event => {
//   //     const eventData = event.returnValues;
//   //     const message = `Event detected: ${JSON.stringify(eventData)}`;
//   //     bot.sendMessage(chatId, message);
//   //   });

//   //   // Update the latest block number
//   //   if (events.length > 0) {
//   //     latestBlock = events[events.length - 1].blockNumber + 1;
//   //   }
//   // } catch (error) {
//   //   console.error('Error fetching or sending events:', error);
//   // }
// };

// module.exports.webhook = async (event, context, callback) => {
//   const token = '7871075053:AAHUBF4qkfT_V-kU6UB5X4y8YWwr40VETPU';
//   const BASE_URL = `https://api.telegram.org/bot${token}/sendMessage`;

//   const body = JSON.parse(event.body)
//   const message = body.message
//   const chatId = message.chat.id
  
//   let responseText = '';

//   if (body.message && body.message.text) {
//     const text = body.message.text;
//     if (text.startsWith('/balance')) {
//       const address = text.split(' ')[1];

//       try {
//         const client = createPublicClient({
//           chain: mode,
//           transport: http(),
//         });
      
//         const contractAddress = '0xB508d9Cd504C740C0C3a7c708F7154c2FC978D16';
    
//         // Assuming the contract has a `balanceOf(address)` function
//         const totalStaked = await client.readContract({
//           address: contractAddress,
//           abi: contractABI,
//           functionName: 'getTotalStaked',
//           // fede: 0xEa5bf2AD6af8168DE10546B3e4D5679bb22305C8
//           args: [address]
//         });
    
//         responseText = `Total Staked of ${address}: ${formatEther(totalStaked).toString()}`;
//         // bot.sendMessage(chatId, `Total Staked of ${address}: ${formatEther(totalStaked).toString()}`);
//       } catch (error) {
//         responseText = `Error: ${error.message}`;
//         // await bot.sendMessage(chatId, `Error: ${error.message}`);
//       }
//     }
//   }



//   request.post(BASE_URL).form({ text: responseText, chat_id: chatId });

//   const response = {
//     statusCode: 200,
//     body: JSON.stringify({
//       input: event,
//     }),
//   };

//   return callback(null, response);

// };

