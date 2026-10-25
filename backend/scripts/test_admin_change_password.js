import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    const baseUrl = process.env.SERVER_URL || 'http://localhost:3000';
    const email = process.env.ADMIN_EMAIL || process.argv[2];
    const password = process.env.ADMIN_PASS || process.argv[3];
    const newPassword = process.argv[4] || `${password}Updated!`;

    if (!email || !password) {
      console.log('Usage: node scripts/test_admin_change_password.js <email> <currentPassword> [newPassword]');
      console.log('Or set ADMIN_EMAIL and ADMIN_PASS environment variables.');
      process.exit(0);
    }

    console.log('Logging in with original credentials...');
    const login1 = await axios.post(`${baseUrl}/api/auth/login`, {
      email,
      password,
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Login1 response:', JSON.stringify(login1.data));
    const token = login1.data.accessToken;
    if (!token) {
      console.error('No accessToken returned');
      process.exit(1);
    }

    console.log('Testing password change...');
    const changeResp = await axios.post(`${baseUrl}/api/auth/change-password`, {
      oldPassword: password,
      newPassword,
    }, { headers: { Authorization: `Bearer ${token}` } });

    console.log('Change response:', JSON.stringify(changeResp.data));

    console.log('Verifying login with updated password...');
    const login2 = await axios.post(`${baseUrl}/api/auth/login`, {
      email,
      password: newPassword,
    }, { headers: { 'Content-Type': 'application/json' } });

    console.log('Login2 response:', JSON.stringify(login2.data));

    console.log('Test completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
})();
