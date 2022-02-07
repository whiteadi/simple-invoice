
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});
const configPost = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const createInvoice = (name: string, email: string, company_name: string, price: number, onNewInvoice: () => void) => {
  api
    .post(
      '/invoices',
      `name=${name}&company_name=${company_name}&email=${email}&price=${price}`,
      configPost
    )
    .then(
      (__response: any) => {
        onNewInvoice();
      },
      (error: any) => {
        console.log(error);
      }
    );
};

const getInvoices = async () => {
  try {
    const response = await api.get('/invoices');
    return response.data?.data;
  } catch (err) {
    console.error('Invoices loading failed:', err);
  }
}

const deleteInvoice = async (invoiceId: number) => {
  try {
    const response = await api.delete(`/invoices/${invoiceId}`);
    return response.data?.message;
  } catch (err) {
    console.error('Invoice deletion failed:', err);
  }
}

const getItems = async (invoiceId: number) => {
  try {
    const response = await api.get(`/items/invoice/${invoiceId}`);
    return response.data?.data;
  } catch (err) {
    console.error('Invoices items loading failed:', err);
  }
}

export { createInvoice, getInvoices, deleteInvoice, getItems };