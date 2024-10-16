const MenuItem = require('../models/MenuItem');
const fs = require('fs');
const path = require('path');

exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll();
    res.status(200).json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      image,
      category,
      price,
    });

    res.status(201).json({ message: 'Menu item created successfully', menuItem });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const { name, description, category, price } = req.body;

    if (req.file) {
      // Delete the old image file
      const oldImagePath = path.join(__dirname, '../../public', menuItem.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) console.error('Error deleting old image:', err);
      });
      menuItem.image = `/uploads/${req.file.filename}`;
    }

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.category = category || menuItem.category;
    menuItem.price = price || menuItem.price;

    await menuItem.save();

    res.status(200).json({ message: 'Menu item updated successfully', menuItem });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Delete the image file
    const imagePath = path.join(__dirname, '../../public', menuItem.image);
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image:', err);
    });

    await menuItem.destroy();

    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};