module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow longer subject lines (default is 72)
    'header-max-length': [2, 'always', 100],
    // Issue references in footer are optional but validated when present
    'footer-leading-blank': [2, 'always'],
    // Scopes that make sense for this project
    'scope-enum': [
      1, // warn (not error) so new scopes don't block commits
      'always',
      [
        'auth',
        'courses',
        'resources',
        'search',
        'profiles',
        'messages',
        'events',
        'tags',
        'collections',
        'navbar',
        'footer',
        'home',
        'api',
        'db',
        'aws',
        'email',
        'react',
        'deps',
        'ci',
        'docs',
      ],
    ],
  },
};
