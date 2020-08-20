import React from 'react';
import { Redirect } from 'react-router-dom';
import { ds } from '../stored/ds';

const Entry = () => {

    let to = '/add';

    if (!ds.token) {
        to = '/403';
    }

    return <Redirect to={to} />

}

export default Entry;