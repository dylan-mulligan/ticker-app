require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const readline = require('readline');
const { getAccountBalance } = require('./KrakenApiSign');
const { getTradeBalance } = require('./KrakenTradeBalance');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMenu() {
  console.log('\nSelect Kraken API call:');
  console.log('1: Get Account Balance');
  console.log('2: Get Trade Balance (ZUSD)');
  console.log('3: Get Trade Balance (custom asset)');
  console.log('0: Exit');

  rl.question('Enter your choice (0/1/2/3): ', async (answer) => {
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
