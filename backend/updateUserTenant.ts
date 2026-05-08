import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching tenants...");
  let tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    console.log("No tenant found. Creating a default tenant...");
    tenant = await prisma.tenant.create({
      data: {
        name: "Main Tenant",
        slug: "main-tenant"
      }
    });
    console.log(`Created tenant: ${tenant.id}`);
  } else {
    console.log(`Found tenant: ${tenant.id} (${tenant.name})`);
  }

  console.log("Fetching all users to diagnose...");
  const allUsers = await prisma.user.findMany();
  
  if (allUsers.length === 0) {
    console.log("No users found in the database.");
    return;
  }

  for (const user of allUsers) {
    console.log(`User: ${user.email} | Role: ${user.role} | TenantId: ${user.tenantId}`);
    
    // If user has no tenant, we assign them the tenant
    if (!user.tenantId) {
      console.log(`Updating user ${user.email} to have tenant ${tenant.id}...`);
      await prisma.user.update({
        where: { id: user.id },
        data: { tenantId: tenant.id }
      });
      console.log(`Successfully updated ${user.email}.`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
