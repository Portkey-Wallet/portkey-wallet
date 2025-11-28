const fs = require('fs');
const path = require('path');

module.exports.tokenInfo = fs.readFileSync(path.join(__dirname, 'tokenInfo.gql'), 'utf8');
module.exports.caHolderTransaction = fs.readFileSync(path.join(__dirname, 'caHolderTransaction.gql'), 'utf8');
module.exports.caHolderTransactionInfo = fs.readFileSync(path.join(__dirname, 'caHolderTransactionInfo.gql'), 'utf8');
module.exports.caHolderManagerInfo = fs.readFileSync(path.join(__dirname, 'caHolderManagerInfo.gql'), 'utf8');
module.exports.caHolderInfo = fs.readFileSync(path.join(__dirname, 'caHolderInfo.gql'), 'utf8');
module.exports.loginGuardianInfo = fs.readFileSync(path.join(__dirname, 'loginGuardianInfo.gql'), 'utf8');
module.exports.caHolderNFTCollectionBalanceInfo = fs.readFileSync(
  path.join(__dirname, 'caHolderNFTCollectionBalanceInfo.gql'),
  'utf8',
);
module.exports.caHolderNFTBalanceInfo = fs.readFileSync(path.join(__dirname, 'caHolderNFTBalanceInfo.gql'), 'utf8');
module.exports.caHolderTokenBalanceInfo = fs.readFileSync(path.join(__dirname, 'caHolderTokenBalanceInfo.gql'), 'utf8');
module.exports.caHolderTransactionAddressInfo = fs.readFileSync(
  path.join(__dirname, 'caHolderTransactionAddressInfo.gql'),
  'utf8',
);
module.exports.loginGuardianChangeRecordInfo = fs.readFileSync(
  path.join(__dirname, 'loginGuardianChangeRecordInfo.gql'),
  'utf8',
);
module.exports.caHolderManagerChangeRecordInfo = fs.readFileSync(
  path.join(__dirname, 'caHolderManagerChangeRecordInfo.gql'),
  'utf8',
);
module.exports.caHolderSearchTokenNFT = fs.readFileSync(path.join(__dirname, 'caHolderSearchTokenNFT.gql'), 'utf8');
module.exports.syncState = fs.readFileSync(path.join(__dirname, 'syncState.gql'), 'utf8');
