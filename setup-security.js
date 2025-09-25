#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupSecurity() {
  console.log('🔐 Blog Security Setup');
  console.log('=====================\n');
  
  console.log('This script will help you set up secure credentials for your blog.\n');
  
  // Check if .env.local already exists
  if (fs.existsSync('.env.local')) {
    const overwrite = await question('⚠️  .env.local already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }
  
  // Get admin username
  const username = await question('Enter admin username (default: admin): ') || 'admin';
  
  // Get admin password
  const password = await question('Enter admin password (min 8 characters): ');
  if (password.length < 8) {
    console.log('❌ Password must be at least 8 characters long.');
    rl.close();
    return;
  }
  
  // Generate JWT secret
  const jwtSecret = crypto.randomBytes(32).toString('base64');
  
  // Create .env.local content
  const envContent = `# Admin Authentication - REQUIRED
# Generated on ${new Date().toISOString()}

ADMIN_USERNAME=${username}
ADMIN_PASSWORD=${password}
JWT_SECRET=${jwtSecret}

# IMPORTANT SECURITY NOTES:
# 1. Keep this file secure and never commit it to version control
# 2. For production, use your hosting platform's environment variable settings
# 3. Change these credentials regularly for better security
`;

  // Write .env.local file
  fs.writeFileSync('.env.local', envContent);
  
  console.log('\n✅ Security setup complete!');
  console.log('📁 Created .env.local with your credentials');
  console.log('🔒 Your credentials are secure and will not be committed to git');
  console.log('\n🚀 You can now run: npm run dev');
  
  rl.close();
}

setupSecurity().catch(console.error);
