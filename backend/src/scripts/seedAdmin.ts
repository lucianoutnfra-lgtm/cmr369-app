import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando proceso de seedeo para Super Admin...');
  
  const email = 'lucho@unitary.ai';
  const password = 'Luna0704';

  const userExists = await prisma.user.findUnique({
    where: { email }
  });

  if (userExists) {
    console.log(`El usuario con el correo ${email} ya existe en la base de datos.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: 'Luciano',
      role: 'SUPER_ADMIN',
    }
  });

  console.log(`✅ Super Admin creado exitosamente: ${superAdmin.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Conexión a Prisma cerrada correctamente.');
  });
