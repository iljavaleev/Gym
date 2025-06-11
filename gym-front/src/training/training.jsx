import { useState } from 'react';
import { DateTimeForm } from '../components/components';
import { useCookies } from 'react-cookie'
import { GetUpdateDeleteTraining } from './get-update-delete';


const Training = () => {
    
    return (
        <> 
            <GetUpdateDeleteTraining/>
        </>
    ); // create form list
};

export { Training };