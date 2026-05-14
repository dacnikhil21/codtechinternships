import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { MASTER_PROJECTS } from '@/lib/masterProjects';

export const dynamic = 'force-dynamic';

// Normalize domain names for fuzzy matching
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Basic protection — require a secret param
  if (secret !== process.env.SEED_SECRET && secret !== 'codtech-seed-2024') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const results = {
    domainsInDB: [],
    seeded: [],
    skipped: [],
    errors: [],
    totalProjectsInserted: 0
  };

  try {
    // ── Step 1: Fetch all domains from DB ──────────────────────────────
    const [allDomains] = await pool.execute('SELECT id, name FROM domains');
    results.domainsInDB = allDomains.map(d => d.name);

    if (allDomains.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No domains found in DB. Run /api/debug/setup first.',
        results
      }, { status: 500 });
    }

    // ── Step 2: For each masterProjects key, find matching domain ──────
    for (const [masterKey, projects] of Object.entries(MASTER_PROJECTS)) {
      const normKey = normalize(masterKey);

      // Try exact match first, then fuzzy
      let domain = allDomains.find(d => normalize(d.name) === normKey);

      if (!domain) {
        // Fuzzy: check if masterKey words appear in domain name
        domain = allDomains.find(d => {
          const normD = normalize(d.name);
          return normD.includes(normKey) || normKey.includes(normD);
        });
      }

      if (!domain) {
        results.skipped.push({ key: masterKey, reason: 'No matching domain in DB' });
        continue;
      }

      try {
        // Clear existing projects for this domain
        await pool.execute('DELETE FROM projects WHERE domain_id = ?', [domain.id]);

        // Insert all projects
        for (const proj of projects) {
          await pool.execute(
            'INSERT INTO projects (name, description, difficulty, domain_id) VALUES (?, ?, ?, ?)',
            [proj.name, proj.description, proj.difficulty, domain.id]
          );
        }

        results.seeded.push({
          masterKey,
          domainName: domain.name,
          domainId: domain.id,
          projectsInserted: projects.length
        });
        results.totalProjectsInserted += projects.length;

      } catch (err) {
        results.errors.push({ masterKey, error: err.message });
      }
    }

    // ── Step 3: Report domains in DB with no master projects ───────────
    const seededDomainNames = results.seeded.map(s => normalize(s.domainName));
    const unseeded = allDomains.filter(d => !seededDomainNames.includes(normalize(d.name)));
    if (unseeded.length > 0) {
      results.unseededDomains = unseeded.map(d => d.name);
    }

    return NextResponse.json({
      success: true,
      message: `Seeding complete. ${results.totalProjectsInserted} projects inserted across ${results.seeded.length} domains.`,
      results
    });

  } catch (error) {
    console.error('[Seed Projects Error]', error);
    return NextResponse.json({
      success: false,
      message: error.message,
      results
    }, { status: 500 });
  }
}
