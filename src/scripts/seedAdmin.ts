import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

async function seedAdmin() {
    try {
        console.log('**** admin seeding started......')
        const adminData = {
            name: 'Admin1 sajed',
            email: 'admin1@admin.com',
            role: UserRole.ADMIN,
            password: 'admin1234',
            emailVerified: true,
        };

        console.log('**** checking admin exist or not******');

        // check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email,
            }
        });

        if (existingUser) {
            throw new Error('Admin user already exists');
        };

        const signUpAdmin = await fetch('http://localhost:3000/api/auth/sign-up/email', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(adminData)
        });
        // console.log(signUpAdmin);
        if(signUpAdmin.ok){
            await prisma.user.update({
                where: {
                    email: adminData.email,
                },
                data: {
                    emailVerified: true,
                }
            });

            console.log("*********** email verification status updated! ********")
        };
        console.log('**** success ******')
    } catch (error) {
        console.error(error);
    }
};

seedAdmin();