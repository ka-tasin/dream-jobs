import prisma from './index.js'; 
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dreamjobs.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
  const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set!');
    console.error('Please set ADMIN_PASSWORD in your .env file');
    process.exit(1);
  }

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        firstName: adminFirstName,
        lastName: adminLastName,
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        provider: 'CREDENTIALS',
        isEmailVerified: true,
        isActive: true,
      },
    });

    console.log('Admin user created successfully');
    console.log('Admin email:', admin.email);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });