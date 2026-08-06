import bcrypt from "bcrypt";

export default {
  async up(queryInterface, Sequelize) {
    // Find the ADMIN role
    const [roles] = await queryInterface.sequelize.query(`
      SELECT id
      FROM roles
      WHERE name = 'ADMIN'
      LIMIT 1;
    `);

    if (!roles.length) {
      throw new Error("ADMIN role not found. Please seed the roles table first.");
    }

    const adminRoleId = roles[0].id;

    // Hash the password
    const passwordHash = await bcrypt.hash("Admin@123", 12);

    // Create the admin user
    await queryInterface.bulkInsert("users", [
      {
        role_id: adminRoleId,
        first_name: "System",
        last_name: "Administrator",
        email: "admin@productapi.com",
        password_hash: passwordHash,
        is_active: true,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "admin@productapi.com",
    });
  },
};