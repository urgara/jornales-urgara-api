#!/usr/bin/env node

/**
 * Script de inicialización de admin por defecto
 * Se ejecuta después de las migraciones para crear el primer usuario admin
 */

const { PrismaClient } = require('../generated/prisma-common');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const argon2 = require('argon2');
const { v6: uuidv6 } = require('uuid');

async function initAdmin() {
  const connectionString = process.env.DATABASE_COMMON_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    console.log('✅ Connected to common database');

    // Verificar si ya existe un admin
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists, skipping initialization');
      return;
    }

    console.log('🔄 Creating default admin user...');

    // Credenciales por defecto (deben cambiarse después del primer login)
    const defaultDni = process.env.DEFAULT_ADMIN_DNI || '12345678';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    const defaultName = process.env.DEFAULT_ADMIN_NAME || 'Dynnamo';
    const defaultSurname = process.env.DEFAULT_ADMIN_SURNAME || 'Sistema';
    const roleNumber = process.env.DEFAULT_ADMIN_ROLE || '1'; // 1 = ADMIN, 5 = LOCAL, 10 = ONLY_READ

    // Mapear número a enum Role
    const roleMap = {
      '1': 'ADMIN',
      '5': 'LOCAL',
      '10': 'ONLY_READ'
    };
    const defaultRole = roleMap[roleNumber] || 'ADMIN';

    // Hashear la contraseña
    const hashedPassword = await argon2.hash(defaultPassword);

    // Generar UUID v6
    const uuid = uuidv6();

    // Crear admin por defecto
    await prisma.admin.create({
      data: {
        id: uuid,
        dni: defaultDni,
        name: defaultName,
        surname: defaultSurname,
        password: hashedPassword,
        role: defaultRole,
        localityId: null,
      },
    });

    console.log('✅ Default admin user created successfully');
    console.log(`📋 DNI: ${defaultDni}`);
    console.log(`🔑 Password: ${defaultPassword}`);
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

initAdmin();
