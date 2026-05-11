require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

/**
 * Start the server:
 * 1. Authenticate PostgreSQL connection
 * 2. Sync Sequelize models (auto-create tables)
 * 3. Start Express server
 */
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');

    // Sync models — creates tables if they don't exist
    // Use { alter: true } in development for schema updates
    // Use { force: true } only to drop & recreate (DANGEROUS in production)
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synced');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`💳 Payment API:  http://localhost:${PORT}/api/payment\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
