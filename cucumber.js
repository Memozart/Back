let common=[
  'tests/features/*.feature',
  '--format-options {"snippetInterface":"async-await"}',
  '--publish-quiet'
].join(' ');


module.exports={
  default:common
};