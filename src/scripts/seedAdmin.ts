import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin(){
    try {
        const adminData = {
            name: 'Admin sajed',
            email: 'admin@admin.com',
            role: UserRole.ADMIN,
            password: 'admin1234',
        }

        // check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            }
        });

        if(existingUser){
            throw new Error('Admin user already exists');
        }
    } catch (error) {
        console.error(error);
    }
}