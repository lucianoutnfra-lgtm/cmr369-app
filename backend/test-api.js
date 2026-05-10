async function testBackend() {
  try {
    const res = await fetch('http://localhost:3001/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Tenant',
        email: 'test@tenant.com',
        password: 'password123',
        role: 'TENANT',
        tenantSlug: 'testslug'
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error(err);
  }
}

testBackend();
