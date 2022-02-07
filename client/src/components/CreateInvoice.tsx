import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

import { Invoice, InvoiceItem } from '../types';
import { StatusTypes } from '../constants';
import { stopPropagation } from '../utils/utile';
import { createInvoice, createItem } from '../api';

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
    { id: -1, name: '', due_date: '', status: StatusTypes.OPEN }
);

const CreateInvoice: FC = () => {
    const [invoice, setInvoice] = useState<Invoice>(emptyInvoice());
    const [items, setItems] = useState<Array<InvoiceItem>>([]);
    const [name, setName] = useState(invoice.name);
    const [dueDate, setDueDate] = useState(invoice.due_date);
    const [status, setStatus] = useState(invoice.status);
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    const handleItemDelete = (item: InvoiceItem) => {
        const newItems: Array<InvoiceItem> | undefined = items?.filter(anItem => anItem.description !== item.description && anItem.price !== item.price);
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
                        handleItemDelete(item);
                        e.stopPropagation();
                    }}>Delete item</StyledButton>
                </td>
            </tr>
        ))
    );
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (invoice.id > -1) {
            // handleEditInvoice(invoice)
        } else {
            setInvoice({ name, due_date: dueDate, status, id: 0, });
            createInvoice(invoice.name, invoice.due_date, invoice.status).then(invoiceId => {
                items.map(item => {
                    return createItem(item.description, item.price, invoiceId);
                }) 
            });            
        };
    }


    return (
        <StyleWrap>
            <h1>{invoice.id > -1 ? 'Edit' : 'New'} Invoice</h1>
            <hr />
            <form id="form" onSubmit={e => { handleSubmit(e) }}>
                <div>
                    <div>
                        <label>  Invoice Name:</label>
                        <input type="text" name={name} value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <label>Due Date</label>
                        <input
                            type="text"
                            placeholder="Ex. 1/1/2017"
                            value={dueDate} onChange={e => setDueDate(e.target.value)}
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
                                    <StyledButton onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        setItems([{ description, price, id: 0, invoiceId: 0, }, ...items]);
                                        setDescription('');
                                        setPrice(0);
                                        e.stopPropagation();
                                    }}>Delete</StyledButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <label>Total</label>
                {makeTotal(items).toLocaleString("en-US")}

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