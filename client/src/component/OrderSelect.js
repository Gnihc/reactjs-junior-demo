import React from 'react';
import { Combobox } from 'react-widgets';
import "./OrderSelect.css"
import "react-widgets/styles.css";

const orders = [
    { title: "Nổi bật", value: "popular" },
    { title: "Mới nhất", value: "new" }
]



function handleChange(selected,reloadList){
    const queryParams = new URLSearchParams(window.location.search);

    if (queryParams && selected.value != "new") {
      queryParams.set('orderBy', selected.value);
    } else {
      queryParams.delete('orderBy');
    }

    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
    reloadList(selected.value)
}

function OrderSelect({ reloadList }) {
    const queryParams = new URLSearchParams(window.location.search);
      
    const sortOrderQuery = queryParams.get("orderBy");
    return (
        <>
            <label>Lọc theo</label>
            <Combobox
                data={orders}
                dataKey='value'
                textField='title'
                title="Lọc theo"
                defaultValue={orders.find(option => option.value == sortOrderQuery) || orders[1]}
                onChange={(selected)=>handleChange(selected,reloadList)}
            />
        </>
    )
}
export default OrderSelect