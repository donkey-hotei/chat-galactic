import React from 'react';
import { render } from 'react-dom';
import ChatGalactic from './components/ChatGalactic';
import subscribeToTimer from './api/client';
import './index.css';

render(
    <ChatGalactic />,
    document.getElementById('root')
)