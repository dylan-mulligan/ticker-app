require('./loadKrakenEnv');
const readline = require('readline');
const { getAccountBalance } = require('./krakenApiSign');
const { getTradeBalance } = require('./krakenTradeBalance');
const { getOpenOrders } = require('./krakenOpenOrders');
const { getClosedOrders } = require('./krakenClosedOrders');
const { getOrdersInfo } = require('./krakenOrdersInfo');
const { getTradeHistory } = require('./krakenTradeHistory');
const { getTradeVolume } = require('./krakenTradeVolume');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\nSelect Kraken API call:');
  console.log('1: Get Account Balance');
  console.log('2: Get Trade Balance (ZUSD)');
  console.log('3: Get Trade Balance (custom asset)');
  console.log('4: Get Open Orders');
  console.log('5: Get Closed Orders');
  console.log('6: Get Orders Info (by txid)');
  console.log('7: Get Trade History');
  console.log('8: Get Trade Volume');
  console.log('0: Exit');

  rl.question('Enter your choice: ', async (answer) => {
    switch (answer.trim()) {
      case '1':
        await getAccountBalance();
        showMenu();
        break;
      case '2':
        await getTradeBalance();
        showMenu();
        break;
      case '3':
        rl.question('Enter asset (e.g., ZUSD, XXBT, ZEUR): ', async (asset) => {
          await getTradeBalance(asset.trim());
          showMenu();
        });
        break;
      case '4':
        await getOpenOrders();
        showMenu();
        break;
      case '5':
        await getClosedOrders();
        showMenu();
        break;
      case '6':
        rl.question('Enter txid(s) (comma separated for multiple): ', async (txid) => {
          if (!txid.trim()) {
            console.log('txid is required.');
            showMenu();
            return;
          }
          await getOrdersInfo({ txid: txid.trim() });
          showMenu();
        });
        break;
      case '7':
        await getTradeHistory();
        showMenu();
        break;
      case '8':
        rl.question('Enter pair(s) (comma separated, e.g., XXBTZUSD,XXBTZEUR) or leave blank for all: ', async (pair) => {
          const options = {};
          if (pair.trim()) options.pair = pair.trim();
          rl.question('Include fee info? (y/n): ', async (feeAnswer) => {
            if (feeAnswer.trim().toLowerCase() === 'y') options.fee_info = true;
            await getTradeVolume(options);
            showMenu();
          });
        });
        break;
      case '0':
        rl.close();
        break;
      default:
        console.log('Invalid choice.');
        showMenu();
    }
  });
}

showMenu();
