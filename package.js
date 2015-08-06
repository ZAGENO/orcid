Package.describe({
  name: 'mleiber:orcid',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'ORCID OAuth flow',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/markleiber/orcid',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('ORCID');

  api.addFiles(
    ['orcid_configure.html', 'orcid_configure.js'],
    'client');

  api.addFiles('orcid_server.js', 'server');
  api.addFiles('orcid_client.js', 'client');
});
