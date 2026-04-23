describe('Full E2E Test Suite', () => {
  describe('Auth Suite', () => {
    require('./auth.e2e-spec');
  });

  describe('Users Suite', () => {
    require('./users.e2e-spec');
  });

  describe('Notifications Suite', () => {
    require('./notifications.e2e-spec');
  });
});
