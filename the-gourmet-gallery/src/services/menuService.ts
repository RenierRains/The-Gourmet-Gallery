import axios from 'axios';

const API_URL = 'http://localhost:5000/api/menu/';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

const getMenuItems = async (): Promise<MenuItem[]> => {
  const response = await axios.get<MenuItem[]>(API_URL);
  return response.data;
};

const menuService = {
  getMenuItems,
};

export default menuService;