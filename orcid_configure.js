Template.configureLoginServiceDialogForOrcid.siteUrl = function () {
  return Meteor.absoluteUrl();
};

Template.configureLoginServiceDialogForOrcid.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'}
  ];
};
