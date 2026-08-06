'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      order_number: {
        type: Sequelize.STRING(25),
        allowNull: false,
        unique: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          'Pending',
          'Processing',
          'Delivered',
          'Cancelled'
        ),
        allowNull: false,
        defaultValue: 'Pending',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Prevent negative order totals
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      ADD CONSTRAINT orders_total_amount_positive
      CHECK (total_amount >= 0);
    `);

    // Prevent empty order numbers
    await queryInterface.sequelize.query(`
      ALTER TABLE orders
      ADD CONSTRAINT orders_order_number_not_empty
      CHECK (TRIM(order_number) <> '');
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_orders_status";
    `);
  },
};