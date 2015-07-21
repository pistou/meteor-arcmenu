Package.describe({
  name: 'pistou:arcmenu',
  version: '0.0.10',
  summary: 'Create arc menus with whoosh effects!',
  git: 'https://github.com/psko/meteor-arcmenu.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(["jquery"], 'client', {weak: false, unordered: false});
  api.addFiles('arcmenu.js', ['client']);
});
