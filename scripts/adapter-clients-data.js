import { v6 as uuidv6 } from 'uuid';

const clients = ``;

// Parse the SQL and generate new UUIDs
const lines = clients.trim().split('\n');
const results = lines.map((line) => {
  if (!line.trim()) return '';

  // Generate a new UUID v6
  const uuid = uuidv6();

  // Replace empty string for id with the generated UUID
  return line.replace(/\(''/, `('${uuid}'`);
});

// Output the result
console.log(results.join('\n'));
