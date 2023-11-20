
import { useState } from 'react';
import "./OptionBar.css";
import { imageTheme } from '../data/imageTheme';


const queryParams = new URLSearchParams(window.location.search);



function OptionBar({ reloadList }) {
  const handleChange = (selected) => {
    if (queryParams && selected.id != "all") {
      queryParams.set('selectedTheme', selected.id);
    } else {
      queryParams.delete('selectedTheme');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
    reloadList(selected.id);
  }


  const themeParamQuery = queryParams.get("selectedTheme");
  const [selectedTheme, setTheme] = useState(
    !!themeParamQuery ? imageTheme.indexOf(imageTheme.find((theme) => theme.id == themeParamQuery)) : 0
  );
  const listItems = imageTheme.map((option, key) =>
    <div key={key}>
      <button
        className={key === selectedTheme ? "option-button option-button--selected" : "option-button"}
        onClick={() => { setTheme(key); handleChange(option) }}
      >
        {option.title}
      </button>
    </div>
  );

  return (
    <ul>{listItems}</ul>
  );
}


export default OptionBar;