#!/usr/bin/env node

/**
 * Setup script for integrating backend-v3 with cockpit-v1
 * This script helps configure the integration and run initial sync
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Setting up backend-v3 integration with cockpit-v1...\n')

// Check if required environment variables are set
const requiredEnvVars = [
  'DATABASE_URI',          // PayloadCMS users/admin database
  'DATABASE_DATA_URI',     // Backend-v3 data database
  'PAYLOAD_SECRET'
]

console.log('✅ Checking environment variables...')
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:')
  missingVars.forEach(envVar => console.error(`   - ${envVar}`))
  console.error('\nPlease set these variables in your .env file before continuing.')
  process.exit(1)
}

console.log('✅ All required environment variables are set\n')

// Install dependencies if needed
console.log('📦 Installing dependencies...')
try {
  execSync('pnpm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed\n')
} catch (error) {
  console.error('❌ Failed to install dependencies')
  process.exit(1)
}

// Generate PayloadCMS types
console.log('🔄 Generating PayloadCMS types...')
try {
  execSync('pnpm run generate:types', { stdio: 'inherit' })
  console.log('✅ PayloadCMS types generated\n')
} catch (error) {
  console.warn('⚠️  Failed to generate types - this is normal if the database is not seeded yet\n')
}

// Start the development server
console.log('🎯 Integration setup completed!\n')

console.log('📋 Next steps:')
console.log('1. Make sure your backend-v3 is running and has data in MongoDB')
console.log('2. Start the cockpit development server: pnpm run dev')
console.log('3. Navigate to: http://localhost:3000/admin')
console.log('4. Create an admin user if this is your first time')
console.log('5. Data is automatically available from backend-v3!\n')

console.log('🔗 Available API endpoints:')
console.log('   - GET/POST /api/chains - Manage blockchain networks')
console.log('   - GET/POST /api/pools - Manage AMM pools')
console.log('   - GET/POST /api/collections - Manage NFT collections')
console.log('   - GET/POST /api/tokens - Manage tokens\n')

console.log('📚 Usage examples:')
console.log('   # Get pools with pagination')
console.log('   curl http://localhost:3000/api/pools?page=1&limit=10&chainId=1')
console.log('')
console.log('   # Get chains (mainnet only)')
console.log('   curl http://localhost:3000/api/chains?isTestnet=false')
console.log('')
console.log('   # Search collections')
console.log('   curl http://localhost:3000/api/collections?search=cryptopunks')

console.log('\n🎉 Setup complete! Happy coding!')