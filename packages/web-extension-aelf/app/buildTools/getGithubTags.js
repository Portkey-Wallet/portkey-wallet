/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

function getLatestAndPreviousTag() {
  try {
    execSync('git pull', { encoding: 'utf-8' });
    const tagsOutput = execSync('git tag --sort=-v:refname', { encoding: 'utf-8' });
    const tags = tagsOutput.split('\n').filter((tag) => tag.startsWith('eoa.ext.v.') && tag.trim() !== '');

    if (tags.length < 2) {
      throw new Error('Not enough tags to determine latest and previous tags.');
    }

    const latestTag = tags[0];
    const previousTag = tags[1];

    console.log('Latest Tag:', latestTag);
    console.log('Previous Tag:', previousTag);

    return { latestTag, previousTag };
  } catch (error) {
    console.error('Error fetching Git tags:', error.message);
    process.exit(1);
  }
}

module.exports = {
  getLatestAndPreviousTag,
};
