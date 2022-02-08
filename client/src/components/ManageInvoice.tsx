import React, { FC, useCallback, useState, useEffect } from 'react';

import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Invoice, InvoiceItem } from '../types';
import { StatusTypes } from '../constants';
import { stopPropagation } from '../utils/utile';
import { createInvoice, createItem, getInvoice, getItems, deleteItem, updateItem, updateInvoice } from '../api';

const StyledButton = styled.button`
  background: 'white';
  color: blue;
  &:hover {
    cursor: pointer;
  }
`;

const StyleWrap = styled.div`
  table {
    margin-bottom: 0;
    td {
      &:nth-child(1) {
        width: 75%;
      }
      &:nth-child(3){
        width: 15%;
      }
      &:nth-child(3){
        width: 10%;
        vertical-align: middle;
      }
      .form-group {
        margin-bottom: 0;
      }
    }
  }
`;

const StyledLink = styled.a`
  background: 'blue';
  color: green;
  text-decoration: none;
  font-size: 12px;
  padding: 1rem;
  font-family: sans-serif;
  border-radius: 5px;
  text-align: center;
  margin: 5px;
  border: '3px solid black';
`;

const emptyInvoice = (): Invoice => (
    { id: -1, name: '', due_date: new Date(), status: StatusTypes.OPEN }
);

const CreateInvoice: FC = () => {
    const [invoice, setInvoice] = useState<Invoice>(emptyInvoice());
    const [items, setItems] = useState<Array<InvoiceItem>>([]);
    const [name, setName] = useState(invoice.name);
    const [dueDate, setDueDate] = useState<Date>(new Date(invoice.due_date));
    const [status, setStatus] = useState(invoice.status);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const navigate = useNavigate();

    let { id } = useParams();

    useEffect(() => {
        if (id) {
            getInvoice(parseInt(id)).then((theInvoice: Invoice) => {
                setInvoice(theInvoice);
                setName(theInvoice.name);
                setDueDate(new Date(theInvoice.due_date));
                setStatus(theInvoice.status);
                getItems(theInvoice.id).then(items => setItems(items));
            });
        }        
    }, [id]);

    const handleItemDelete = (item: InvoiceItem) => {
        const newItems: Array<InvoiceItem> | undefined = items?.filter(anItem => anItem.description !== item.description || anItem.price !== item.price);
        setItems(newItems);
    }

    const makeTotal = useCallback((items: Array<InvoiceItem>) =>
        items.reduce((acc, item) => (acc + item.price), 0), []);

    const showItems = () => (
        items.map((item, idx) => (
            <tr key={idx}>
                <td>{item.description}</td>
                <td>{(item.price).toLocaleString("en-US")}</td>
                <td>
                    <StyledButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {                        
                        e.stopPropagation();
                        handleItemDelete(item);
                    }}>Delete item</StyledButton>
                </td>
            </tr>
        ))
    );
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (invoice.id > -1) {
            getItems(invoice.id).then((oldItems: InvoiceItem[]) => {
                const oldItemsIds = oldItems.map((oldItem: InvoiceItem) => oldItem.id);
                const existingItemsIds = items.map((existingItem: InvoiceItem) => existingItem.id).filter(itemId => itemId !== 0);
                const deletedOldItemIds = oldItemsIds.filter((oldItemId: number) => !existingItemsIds.includes(oldItemId));
                const updatedOldItemIds = oldItemsIds.filter((oldItemId: number) => existingItemsIds.includes(oldItemId));
                const newItems = items.filter((newItem: InvoiceItem) => newItem.id === 0);
                deletedOldItemIds.forEach((deletedItemId: number) => {
                    deleteItem(deletedItemId);
                });
                updatedOldItemIds.forEach((updatedItemId: number) => {
                    items.filter(item => item.id === updatedItemId).forEach(itemToUpdate => {
                        updateItem(updatedItemId, itemToUpdate.description, itemToUpdate.price, itemToUpdate.invoiceId);
                    });
                });
                newItems.map(toCreateItem => {
                    return createItem(toCreateItem.description, toCreateItem.price, invoice.id);
                });
            });
            updateInvoice(invoice.id, name, dueDate, status);
        } else {
            setInvoice({ name, due_date: dueDate, status, id: -1, });
            createInvoice(name, dueDate, status).then(invoiceId => {
                items.map(item => {
                    return createItem(item.description, item.price, invoiceId);
                });                
            });            
        };
        navigate('/');
    }


    return (
        <StyleWrap>
            <h1>{invoice.id > -1 ? 'Edit' : 'New'} Invoice</h1>
            <hr />
            <form id="form" onSubmit={e => { handleSubmit(e) }}>
                <div>
                    <div>
                        <label>Invoice Name:</label>
                        <input type="text" name={name} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Due Date</label>
                        <DatePicker
                            dateFormat="dd/MM/yyyy"
                            selected={dueDate}
                            onChange={(date: Date) => {
                                setDueDate(date);
                            }}
                        />
                    </div>
                    <div>
                        <label>Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)}>
                            {Object.keys(StatusTypes).map((key, _index) => {
                                type K = keyof typeof StatusTypes;
                                const theKey = key as K;
                                return (
                                    <option key={key} value={StatusTypes[theKey]}>{key}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>

                <label>Invoice Items</label>
                <div className="well">
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showItems()}
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={description}
                                        placeholder="Enter item description"
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={price}
                                        placeholder="Enter item price"
                                        onChange={e => setPrice(parseFloat(e.target.value))}
                                    />
                                </td>
                                <td>
                                    <StyledButton type="button" onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
                                        setItems([{ description, price, id: 0, invoiceId: -1, }, ...items]);
                                        setDescription('');
                                        setPrice(0);                                        
                                    }}>Add item</StyledButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <label>Total</label>
                </div>
                <div>
                {makeTotal(items).toLocaleString("en-US")}
                </div>

                <div className="text-right">
                    <StyledLink href="/" onClick={stopPropagation}>Cancel</StyledLink>
                    <input type="submit" value="Save" />
                </div>
            </form>
            <p />
        </StyleWrap>
    )
};

export default CreateInvoice;