'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },

      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
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

    // Quantity must be at least 1
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items
      ADD CONSTRAINT order_items_quantity_positive
      CHECK (quantity > 0);
    `);

    // Unit price cannot be negative
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items
      ADD CONSTRAINT order_items_unit_price_positive
      CHECK (unit_price >= 0);
    `);

    // Discount must be NULL or between 0 and 100
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items
      ADD CONSTRAINT order_items_discount_range
      CHECK (
        discount_percentage IS NULL
        OR (
          discount_percentage >= 0
          AND discount_percentage <= 100
        )
      );
    `);

    // Subtotal cannot be negative
    await queryInterface.sequelize.query(`
      ALTER TABLE order_items
      ADD CONSTRAINT order_items_subtotal_positive
      CHECK (subtotal >= 0);
    `);

      await queryInterface.addConstraint('order_items', {
      fields: ['order_id', 'product_id'],
      type: 'unique',
      name: 'unique_product_per_order',
    });

  },

 
  async down(queryInterface) {
    await queryInterface.dropTable('order_items');
  },
};