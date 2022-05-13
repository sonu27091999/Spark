import React from 'react'
import loading from './loading.gif'

export default function Spinner() {
    return (
        <div className='d-flex justify-content-center align-items-center my-3'>
            <img src={loading} alt="loading" />
        </div>
    )
}