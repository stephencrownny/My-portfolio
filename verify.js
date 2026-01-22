const http = require('http');

function makeRequest(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ headers: res.headers, statusCode: res.statusCode, data }));
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runTests() {
  console.log('Starting Verification...');

  // 1. Check Security Headers (Helmet)
  console.log('\nTest 1: Security Headers (Helmet)');
  try {
    const res = await makeRequest('/');
    const csp = res.headers['content-security-policy'];
    if (csp) {
      console.log('✅ CSP Header present:', csp);
    } else {
      console.log('❌ CSP Header MISSING');
    }
    if (res.headers['x-dns-prefetch-control']) console.log('✅ X-DNS-Prefetch-Control present');
  } catch (e) {
    console.error('❌ Failed to connect to server', e);
  }

  // 2. Check Rate Limiting
  console.log('\nTest 2: Rate Limiting Headers');
  try {
    const res = await makeRequest('/resume/download');
    if (res.headers['ratelimit-limit']) {
      console.log('✅ Rate Limit headers present');
      console.log(`   Limit: ${res.headers['ratelimit-limit']}`);
      console.log(`   Remaining: ${res.headers['ratelimit-remaining']}`);
    } else {
      console.log('❌ Rate Limit headers MISSING');
    }
  } catch (e) { console.error(e); }

  // 3. Input Validation
  console.log('\nTest 3: Input Validation');
  try {
    const payload = JSON.stringify({ name: 'A', email: 'bad-email', message: 'short' });
    const res = await makeRequest('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }, payload);

    if (res.statusCode === 400) {
      console.log('✅ Validation correctly rejected invalid input (400 Bad Request)');
      console.log('   Response:', res.data);
    } else {
      console.log(`❌ Validation FAILED. Expected 400, got ${res.statusCode}`);
    }
  } catch (e) { console.error(e); }

    // 4. Valid Input
  console.log('\nTest 4: Valid Input');
  try {
    const payload = JSON.stringify({ name: 'Good Name', email: 'good@example.com', message: 'This is a long enough message.' });
    const res = await makeRequest('/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }, payload);

    if (res.statusCode === 200) {
      console.log('✅ Valid input accepted (200 OK)');
    } else {
      console.log(`❌ Valid input FAILED. Expected 200, got ${res.statusCode}`);
      console.log('   Response:', res.data);
    }
  } catch (e) { console.error(e); }
}

runTests();
