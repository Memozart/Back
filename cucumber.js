let common=[
  'tests/features/is_it_friday_yet.feature',
  '--format-options {"snippetInterface":"async-await"}',
  '--publish-quiet'
].join(' ');


module.exports={
  default:common
}