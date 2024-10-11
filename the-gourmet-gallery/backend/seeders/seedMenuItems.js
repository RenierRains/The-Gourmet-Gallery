const sequelize = require('../config/database');
const MenuItem = require('../models/MenuItem');

const menuItems = [
  {
    name: 'Foie Gras with Brioche',
    description: 'A rich and buttery foie gras, perfectly seared, served on toasted brioche for a delicate balance of flavors and textures.',
    image: '/uploads/Foie Gras with Brioche',
    category: 'Main Course',
    price: 3460,
  },
  {name: 'Foie Gras with Brioche',
    description: 'A rich and buttery foie gras, perfectly seared, served on toasted brioche for a delicate balance of flavors and textures.',
    image: '/uploads/Foie Gras with Brioche',
    category: 'Main Course',
    price: 3460,
  },
];

const seedMenuItems = async () => {
  try {
    await sequelize.sync({ force: true }); // drop existing tables
    await MenuItem.bulkCreate(menuItems);
    console.log('Menu items seeded');
    process.exit();
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
};

seedMenuItems();
