const fs = require('fs');
const path = require('path');

module.exports.discoverGroup = fs.readFileSync(path.join(__dirname, 'discoverGroup.gql'), 'utf8');
module.exports.discoverGroup_by_id = fs.readFileSync(path.join(__dirname, 'discoverGroup_by_id.gql'), 'utf8');
module.exports.discoverGroup_aggregated = fs.readFileSync(path.join(__dirname, 'discoverGroup_aggregated.gql'), 'utf8');
module.exports.discoverItem = fs.readFileSync(path.join(__dirname, 'discoverItem.gql'), 'utf8');
module.exports.discoverItem_by_id = fs.readFileSync(path.join(__dirname, 'discoverItem_by_id.gql'), 'utf8');
module.exports.discoverItem_aggregated = fs.readFileSync(path.join(__dirname, 'discoverItem_aggregated.gql'), 'utf8');
module.exports.socialMedia = fs.readFileSync(path.join(__dirname, 'socialMedia.gql'), 'utf8');
module.exports.socialMedia_by_id = fs.readFileSync(path.join(__dirname, 'socialMedia_by_id.gql'), 'utf8');
module.exports.socialMedia_aggregated = fs.readFileSync(path.join(__dirname, 'socialMedia_aggregated.gql'), 'utf8');
module.exports.tabMenu = fs.readFileSync(path.join(__dirname, 'tabMenu.gql'), 'utf8');
module.exports.tabMenu_by_id = fs.readFileSync(path.join(__dirname, 'tabMenu_by_id.gql'), 'utf8');
module.exports.tabMenu_aggregated = fs.readFileSync(path.join(__dirname, 'tabMenu_aggregated.gql'), 'utf8');
module.exports.tabType = fs.readFileSync(path.join(__dirname, 'tabType.gql'), 'utf8');
module.exports.tabType_by_id = fs.readFileSync(path.join(__dirname, 'tabType_by_id.gql'), 'utf8');
module.exports.tabType_aggregated = fs.readFileSync(path.join(__dirname, 'tabType_aggregated.gql'), 'utf8');
