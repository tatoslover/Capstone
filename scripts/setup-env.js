#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  log(`${colors.bright}${colors.blue}🔧 Planeswalker's Primer - Environment Setup${colors.reset}\n`);

  const projectRoot = path.resolve(__dirname, '..');
  const backendDir = path.join(projectRoot, 'backend');
  const frontendDir = path.join(projectRoot, 'frontend');

  log('This script will help you set up environment variables for local development.\n');

  // Database setup options
  log(`${colors.cyan}${colors.bright}Database Setup Options:${colors.reset}`);
  log('1. Railway Cloud Database (Production/Staging)');
  log('2. Local PostgreSQL');
  log('3. Docker PostgreSQL');
  log('4. Skip database setup');

  const dbChoice = await question('\nChoose database option (1-4): ');

  let databaseUrl = '';

  switch(dbChoice) {
    case '1':
      log(`\n${colors.yellow}Railway Cloud Database Setup:${colors.reset}`);
      log('1. Go to https://railway.app and create a PostgreSQL database');
      log('2. Copy the DATABASE_URL from Railway dashboard');
      databaseUrl = await question('Enter your Railway DATABASE_URL: ');
      break;

    case '2':
      log(`\n${colors.yellow}Local PostgreSQL Setup:${colors.reset}`);
      log('Make sure PostgreSQL is installed and running locally.');

      const host = await question('Database host (default: localhost): ') || 'localhost';
      const port = await question('Database port (default: 5432): ') || '5432';
      const username = await question('Database username (default: postgres): ') || 'postgres';
      const password = await question('Database password: ');
      const database = await question('Database name (default: plansewalker_primer): ') || 'plansewalker_primer';

      databaseUrl = `postgresql://${username}:${password}@${host}:${port}/${database}`;
      break;

    case '3':
      log(`\n${colors.yellow}Docker PostgreSQL Setup:${colors.reset}`);
      log('This will use default Docker PostgreSQL settings.');
      log('Run this command to start PostgreSQL in Docker:');
      log(`${colors.cyan}docker run --name plansewalker-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=plansewalker_primer -p 5432:5432 -d postgres:13${colors.reset}`);

      const useDefault = await question('Use default Docker settings? (y/n): ');
      if (useDefault.toLowerCase() === 'y') {
        databaseUrl = 'postgresql://postgres:password@localhost:5432/plansewalker_primer';
      } else {
        const dockerHost = await question('Docker host (default: localhost): ') || 'localhost';
        const dockerPort = await question('Docker port (default: 5432): ') || '5432';
        const dockerPassword = await question('Docker password (default: password): ') || 'password';
        const dockerDb = await question('Docker database (default: plansewalker_primer): ') || 'plansewalker_primer';

        databaseUrl = `postgresql://postgres:${dockerPassword}@${dockerHost}:${dockerPort}/${dockerDb}`;
      }
      break;

    case '4':
      log(`\n${colors.yellow}Skipping database setup. You can configure it later.${colors.reset}`);
      databaseUrl = 'postgresql://localhost:5432/plansewalker_primer';
      break;

    default:
      log(`${colors.red}Invalid option. Using default local setup.${colors.reset}`);
      databaseUrl = 'postgresql://localhost:5432/plansewalker_primer';
  }

  // Backend environment file
  log(`\n${colors.cyan}Creating backend .env file...${colors.reset}`);

  const backendEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=${databaseUrl}

# API Keys
SCRYFALL_API_URL=https://api.scryfall.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Generated on ${new Date().toISOString()}
`;

  const backendEnvPath = path.join(backendDir, '.env');

  try {
    fs.writeFileSync(backendEnvPath, backendEnv);
    log(`✅ Created ${backendEnvPath}`, colors.green);
  } catch (error) {
    log(`❌ Failed to create backend .env: ${error.message}`, colors.red);
  }

  // Frontend environment file
  log(`${colors.cyan}Creating frontend .env.local file...${colors.reset}`);

  const frontendEnv = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# External APIs
NEXT_PUBLIC_SCRYFALL_API_URL=https://api.scryfall.com

# Generated on ${new Date().toISOString()}
`;

  const frontendEnvPath = path.join(frontendDir, '.env.local');

  try {
    fs.writeFileSync(frontendEnvPath, frontendEnv);
    log(`✅ Created ${frontendEnvPath}`, colors.green);
  } catch (error) {
    log(`❌ Failed to create frontend .env.local: ${error.message}`, colors.red);
  }

  // Test database connection option
  if (databaseUrl && dbChoice !== '4') {
    log(`\n${colors.yellow}Would you like to test the database connection?${colors.reset}`);
    const testDb = await question('Test database connection? (y/n): ');

    if (testDb.toLowerCase() === 'y') {
      await testDatabaseConnection(databaseUrl);
    }
  }

  // Summary and next steps
  log(`\n${colors.cyan}${colors.bright}📋 Setup Complete!${colors.reset}`);
  log(`\n${colors.green}Environment files created:${colors.reset}`);
  log(`• ${backendEnvPath}`);
  log(`• ${frontendEnvPath}`);

  log(`\n${colors.yellow}Next Steps:${colors.reset}`);
  log('1. Start the backend server:');
  log(`   ${colors.cyan}cd backend && npm start${colors.reset}`);
  log('2. Start the frontend server:');
  log(`   ${colors.cyan}cd frontend && npm run dev${colors.reset}`);
  log('3. Test the routes:');
  log(`   ${colors.cyan}node scripts/test-frontend-routes.js${colors.reset}`);

  if (databaseUrl) {
    log('4. Test backend connection:');
    log(`   ${colors.cyan}node scripts/test-connection.js${colors.reset}`);
  }

  log(`\n${colors.green}🎉 Your Planeswalker's Primer should now be ready to run!${colors.reset}`);

  rl.close();
}

async function testDatabaseConnection(databaseUrl) {
  log(`\n${colors.cyan}Testing database connection...${colors.reset}`);

  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: databaseUrl });

    await pool.query('SELECT NOW()');
    log(`✅ Database connection successful!`, colors.green);

    await pool.end();
  } catch (error) {
    log(`❌ Database connection failed: ${error.message}`, colors.red);
    log(`\n${colors.yellow}Common issues:${colors.reset}`);
    log('• Make sure PostgreSQL is running');
    log('• Check username and password');
    log('• Verify database exists');
    log('• For Docker: ensure container is running');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log(`\n\n${colors.yellow}Setup cancelled.${colors.reset}`);
  rl.close();
  process.exit(0);
});

// Run setup if this file is executed directly
if (require.main === module) {
  setupEnvironment().catch(error => {
    log(`\n💥 Setup failed: ${error.message}`, colors.red);
    rl.close();
    process.exit(1);
  });
}

module.exports = { setupEnvironment };
