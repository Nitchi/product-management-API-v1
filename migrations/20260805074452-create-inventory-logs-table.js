'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventory_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      performed_by_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      quantity_change: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      reason: {
        type: Sequelize.ENUM(
          'RESTOCK',
          'ORDER',
          'DAMAGED',
          'ADJUSTMENT'
        ),
        allowNull: false,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Quantity change cannot be zero
    await queryInterface.sequelize.query(`
      ALTER TABLE inventory_logs
      ADD CONSTRAINT inventory_logs_quantity_not_zero
      CHECK (quantity_change <> 0);
    `);

    // Prevent blank notes when provided
    await queryInterface.sequelize.query(`
      ALTER TABLE inventory_logs
      ADD CONSTRAINT inventory_logs_notes_not_empty
      CHECK (
        notes IS NULL
        OR TRIM(notes) <> ''
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventory_logs');

    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_inventory_logs_reason";
    `);
  },
};