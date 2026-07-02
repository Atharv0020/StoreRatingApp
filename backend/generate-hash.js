const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Test@1234', 10);
console.log('Hash:', hash);
console.log('\n✅ MySQL मध्ये हा वापरा:');
console.log(hash);