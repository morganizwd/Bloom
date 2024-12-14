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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(state => state.categories.categories);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Состояния для подтверждения удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Состояния для уведомлений
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() !== '') {
      dispatch(createCategory({ name: newCategoryName }))
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: 'Категория успешно добавлена', severity: 'success' });
          setNewCategoryName('');
        })
        .catch((error) => {
          setSnackbar({ open: true, message: 'Ошибка при добавлении категории', severity: 'error' });
          console.error('Ошибка при добавлении категории:', error);
        });
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      dispatch(deleteCategory(categoryToDelete._id))
        .unwrap()
        .then(() => {
          setSnackbar({ open: true, message: 'Категория успешно удалена', severity: 'success' });
        })
        .catch((error) => {
          setSnackbar({ open: true, message: 'Ошибка при удалении категории', severity: 'error' });
          console.error('Ошибка при удалении категории:', error);
        });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container>
      <Typography variant="h4" style={{ margin: '20px 0' }}>Управление категориями</Typography>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Название новой категории"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          style={{ marginRight: '10px', flex: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddCategory}
        >
          Добавить категорию
        </Button>
      </div>

      <List>
        {categories.map((category) => (
          <ListItem key={category._id} divider>
            <ListItemText primary={category.Name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteClick(category)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Подтвердите удаление</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить категорию "{categoryToDelete?.Name}"? Это действие невозможно отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Отмена
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CategoriesPage;