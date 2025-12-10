import React from 'react';
import egptlogo from '../assets/EternalGPT.svg'
import LoginComponent from '../components/logincomponent.jsx'
import {Link} from "react-router-dom";

export default function Login() {
    return (
        <div className="flex flex-col items-center h-screen justify-center text-center bg-black text-white">
            <img src={egptlogo} alt="EternalGPT" style={{ width: '21.5%' }} className="" />
            <h1>Eternal Knowledge, Eternal Answers</h1>
            <LoginComponent />
        </div>
    );
}