const http = require('http');

function makeRequest() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function verifyGallery() {
  console.log('Verifying Gallery Integration...');
  
  try {
    const { statusCode, data } = await makeRequest();
    
    if (statusCode !== 200) {
      console.error(`❌ Server returned status ${statusCode}`);
      return;
    }
    
    console.log('✅ Server is reachable');

    // Check for Masonry Layout
    if (data.includes('columns-1 md:columns-2 lg:columns-3')) {
      console.log('✅ Masonry layout classes found');
    } else {
      console.error('❌ Masonry layout classes NOT found');
    }

    // Check for Images
    const expectedImages = ['coding 1.jpg', 'ai 1.jpg']; // Just checking a couple known ones
    let imagesFound = 0;
    expectedImages.forEach(img => {
      if (data.includes(img)) {
        console.log(`✅ Image found in response: ${img}`);
        imagesFound++;
      }
    });

    if (imagesFound > 0) {
      console.log('✅ Gallery seems to be rendering dynamic images');
    } else {
      console.warn('⚠️ No specific known images found (might need to check actual image names in folder)');
    }

  } catch (err) {
    console.error('❌ Failed to connect to server:', err.message);
    console.log('HINT: Make sure the server is running (npm start)');
  }
}

verifyGallery();
