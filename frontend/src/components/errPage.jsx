import React from 'react';

export default function ErrPage({ error }) {
    return (
        <div className="flex flex-col justify-center items-center text-center" style={{fontFamily: "sans-serif"}}>
            <h1 className="text-red-600 text-lg">Oops! Something went wrong!</h1>
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <h3 onClick={window.location.reload}>Reload the page to <i className="font-bold">maybe</i> fix the error.</h3>
        </div>
    );
}