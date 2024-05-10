import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories, createCategory, deleteCategory } from '../redux/slices/categories';
import {
  Container,
  Button,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      dispatch(createCategory({ name: newCategoryName }));
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    dispatch(deleteCategory(categoryId));
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Управление категориями</Typography>
      
      <TextField
        label="Название новой категории"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCategory}
      >
        Добавить категорию
      </Button>

      <List>
        {categories.map((category) => (
          <ListItem key={category._id}>
            <ListItemText primary={category.Name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteCategory(category._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default CategoriesPage;