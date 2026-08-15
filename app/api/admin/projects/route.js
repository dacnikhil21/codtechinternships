import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { isAdmin } from '@/lib/adminCheck';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('domainId');
    const difficulty = searchParams.get('difficulty');
    const q = searchParams.get('q');

    let query = `
      SELECT p.*, d.name as domainName 
      FROM projects p 
      LEFT JOIN domains d ON p.domain_id = d.id 
      WHERE 1=1
    `;
    const params = [];

    if (domainId) {
      query += ` AND p.domain_id = ?`;
      params.push(domainId);
    }

    if (difficulty) {
      query += ` AND p.difficulty = ?`;
      params.push(difficulty);
    }

    if (q) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    query += ` ORDER BY p.id DESC`;

    const [projects] = await pool.execute(query, params);

    return NextResponse.json({ success: true, projects });

  } catch (error) {
    console.error('FETCH PROJECTS ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      name, description, domain_id, difficulty, technologies, duration, 
      github_requirement, learning_outcome, project_scope, image_url, instructions 
    } = body;

    const [result] = await pool.execute(
      `INSERT INTO projects (
        name, description, domain_id, difficulty, technologies, duration, 
        github_requirement, learning_outcome, project_scope, image_url, instructions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, description, domain_id, difficulty, technologies, duration, 
        github_requirement ? 1 : 0, learning_outcome, project_scope, image_url, instructions
      ]
    );

    return NextResponse.json({ success: true, message: 'Project created', id: result.insertId });

  } catch (error) {
    console.error('CREATE PROJECT ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { 
      id, name, description, domain_id, difficulty, technologies, duration, 
      github_requirement, learning_outcome, project_scope, image_url, instructions 
    } = body;

    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await pool.execute(
      `UPDATE projects SET 
        name = ?, description = ?, domain_id = ?, difficulty = ?, 
        technologies = ?, duration = ?, github_requirement = ?, 
        learning_outcome = ?, project_scope = ?, image_url = ?, 
        instructions = ? 
      WHERE id = ?`,
      [
        name, description, domain_id, difficulty, technologies, duration, 
        github_requirement ? 1 : 0, learning_outcome, project_scope, image_url, instructions, id
      ]
    );

    return NextResponse.json({ success: true, message: 'Project updated' });

  } catch (error) {
    console.error('UPDATE PROJECT ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();

    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Project deleted' });

  } catch (error) {
    console.error('DELETE PROJECT ERROR:', error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
