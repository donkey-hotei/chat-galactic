import React from 'react';
import { render } from 'react-dom';
import ChatGalactic from './components/ChatGalactic';
import './api/client';

import './styles/base.scss';

render(
    <ChatGalactic />,
    document.getElementById('root')
)