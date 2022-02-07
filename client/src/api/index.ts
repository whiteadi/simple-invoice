
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
const configPost = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const createInvoice = async (name: string, due_date: string, status: string): Promise<number> => {
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

const createItem = (description: string, price: number, invoiceId: number) => {
  api
    .post(
      '/api/items',
      `description=${description}&price=${price}&invoiceId=${invoiceId}`,
      configPost
    )
    .then(
      (__response: any) => {
        return true;
      },
      (error: any) => {
        console.log(error);
      }
    );
};

export { createInvoice, getInvoices, deleteInvoice, getItems, createItem };