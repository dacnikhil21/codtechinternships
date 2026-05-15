const { execSync } = require('child_process');
try {
    console.log('--- Git Status ---');
    console.log(execSync('git status', { encoding: 'utf8' }));
    
    console.log('\n--- Adding changes ---');
    execSync('git add .');
    
    console.log('\n--- Committing ---');
    execSync('git commit -m "feat: add banner headers to placement hub and job hunting sections"');
    
    console.log('\n--- Pushing ---');
    console.log(execSync('git push', { encoding: 'utf8' }));
    
} catch (err) {
    console.error('Error executing git command:');
    console.error(err.stdout || err.message);
}
