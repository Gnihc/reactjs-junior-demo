import './Home.css';

import OptionBar from '../../component/OptionBar.js'
import OrderSelect from '../../component/OrderSelect.js'
import ImageList from '../../component/ImageList.js';
import UploadImage from '../../component/UploadImage';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';



export default function Home() {
    const [seed,setSeed] = useState(null)

    return (
        <>
            <div className="navbar">
                <div>
                    <OrderSelect reloadList={setSeed} />
                </div>
                <OptionBar reloadList={setSeed}/>
                <div>
                    <UploadImage reloadList={setSeed} />
                </div>
            </div>
            <ImageList key={seed}/>
            <ToastContainer />
        </>
    );
}