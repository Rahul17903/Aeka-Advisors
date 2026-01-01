import api from './utils/api';

async function testAPI() {
  console.log('Testing API connection...');
  
  try {
    // Test 1: Basic API endpoint
    console.log('Test 1: Testing /api/test endpoint...');
    const test1 = await api.get('/test');
    console.log('✓ Test endpoint response:', test1.data);
    
    // Test 2: Featured artworks
    console.log('Test 2: Testing /api/artwork/featured endpoint...');
    const test2 = await api.get('/artwork/featured');
    console.log('✓ Featured artworks:', test2.data.length, 'items');
    
    // Test 3: Check response structure
    if (Array.isArray(test2.data)) {
      console.log('✓ Response is an array');
      if (test2.data.length > 0) {
        console.log('✓ First artwork:', {
          id: test2.data[0]._id,
          title: test2.data[0].title,
          imageUrl: test2.data[0].imageUrl
        });
      } else {
        console.log('⚠ No artworks in database');
      }
    } else {
      console.error('✗ Response is not an array:', test2.data);
    }
    
    return true;
  } catch (error) {
    console.error('✗ API Test failed:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Full URL:', error.config?.baseURL + error.config?.url);
    }
    
    return false;
  }
}

// Run test
testAPI().then(success => {
  console.log(success ? '✅ All tests passed!' : '❌ Tests failed');
});