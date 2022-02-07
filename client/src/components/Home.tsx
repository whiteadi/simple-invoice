import React, { FC, useEffect, useState, useCallback } from 'react';

import Invoices from './Invoices'; 
import { getInvoices, deleteInvoice } from '../api';

const Home: FC = () => {
    const [invoices, setInvoices] = useState([]);
    const [state, setState] = useState<{}>();

    useEffect(() => {
        getInvoices().then(allInvoices => {            
            setInvoices(allInvoices);
        });
    }, [state]);

    const handleDelete = useCallback((id) => {
        deleteInvoice(id);
        setState({});
    }, []);

    return (
        <Invoices invoices={invoices} handleDelete={handleDelete} />
    )
};

export default Home;