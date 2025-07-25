/**
 * Health Check and Environment Validation
 * This file helps verify that all required environment variables are set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'SESSION_SECRET',
  'EMAIL_USER',
  'EMAIL_PASS'
];

const checkEnvironment = () => {
  console.log('🔍 Checking environment variables...');
  
  const missing = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    console.error('\n📝 Please check your .env file or Vercel environment variables.');
    console.error('📖 See DEPLOYMENT_GUIDE.md for setup instructions.');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Base URL: ${process.env.BASE_URL || 'http://localhost:8000'}`);
  console.log(`📧 Email Service: ${process.env.EMAIL_SERVICE || 'gmail'}`);
  console.log(`👤 Email User: ${process.env.EMAIL_USER || 'not set'}`);
};

module.exports = { checkEnvironment };
