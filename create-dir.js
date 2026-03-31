try {
  const targetDir = process.argv[2] || 'frontend/app/[locale]/admin/community';
  require('fs').mkdirSync(targetDir, { recursive: true });
  console.log(`Directory '${targetDir}' created successfully`);
} catch (error) {
  console.error(`Failed to create directory: ${error.message}`);
  process.exit(1);
}
