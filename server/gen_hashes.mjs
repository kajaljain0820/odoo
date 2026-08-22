import bcrypt from 'bcrypt';
const passwords = ['Admin@1234', 'Alice@1234', 'Bob@1234'];
const hashes = await Promise.all(passwords.map(p => bcrypt.hash(p, 12)));
hashes.forEach((h, i) => console.log(`${i}: ${h}`));
