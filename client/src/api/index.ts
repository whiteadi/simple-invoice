import axios from 'axios';

const port = process.env.PORT || 8000;

const api = axios.create({
  baseURL: `http://localhost:${port}/api/`,
});
const configPost = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const createInvoice = async (name: string, due_date: Date, status: string): Promise<number> => {
  try {
    const response = await api.post(
      '/invoices',
      `name=${name}&due_date=${due_date}&status=${status}`,
      configPost
    );
    return response.data?.id;
  } catch (err) {
    console.error('Invoice creation failed:', err);
    return 0;
  };
};

const updateInvoice = async (invoiceId: number, name: string, due_date: Date, status: string): Promise<number> => {
  try {
    const response = await api.post(
      `/invoices/${invoiceId}`,
      `name=${name}&due_date=${due_date}&status=${status}`,
      configPost
    );
    return response.data?.changes;
  } catch (err) {
    console.error('Invoice update failed:', err);
    return 0;
  };
};

const getInvoice = async (id: number) => {
  try {
    const response = await api.get(`/invoices/${id}`);
    return response.data?.data;
  } catch (err) {
    console.error('Invoice loading failed:', err);
  };
};

const getInvoices = async () => {
  try {
    const response = await api.get('/invoices');
    return response.data?.data;
  } catch (err) {
    console.error('Invoices loading failed:', err);
  };
};

const deleteInvoice = async (invoiceId: number) => {
  try {
    const response = await api.delete(`/invoices/${invoiceId}`);
    return response.data?.message;
  } catch (err) {
    console.error('Invoice deletion failed:', err);
  };
};

const getItems = async (invoiceId: number) => {
  try {
    const response = await api.get(`/items/invoice/${invoiceId}`);
    return response.data?.data;
  } catch (err) {
    console.error('Invoices items loading failed:', err);
  };
};

const createItem = async (description: string, price: number, invoiceId: number): Promise<number> => {
  try {
    const response = await api.post(
      '/items',
      `description=${description}&price=${price}&invoiceId=${invoiceId}`,
      configPost
    );
    return response.data?.id;
  } catch (err) {
    console.error('Item creation failed:', err);
    return 0;
  };
};

const updateItem = async (itemId: number, description: string, price: number, invoiceId: number): Promise<number> => {
  try {
    const response = await api.post(
      `/items/${itemId}`,
      `description=${description}&price=${price}&invoiceId=${invoiceId}`,
      configPost
    );
    return response.data?.changes;
  } catch (err) {
    console.error('Item update failed:', err);
    return 0;
  };
};

const deleteItem = async (itemId: number) => {
  try {
    const response = await api.delete(`/items/${itemId}`);
    return response.data?.message;
  } catch (err) {
    console.error('Item deletion failed:', err);
  };
};

export { createInvoice, getInvoices, deleteInvoice, getItems, createItem, getInvoice, updateInvoice, updateItem, deleteItem };