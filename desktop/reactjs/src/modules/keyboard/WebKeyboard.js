import React, { useState, useEffect } from 'react';
import './WebKeyboard.scss';
import { keyboardRows } from './key-map';

let cleanUpTimeout;

function WebKeyboard(props) {
  const { keyboardText, setKeyboardText } = props;

  const [activeKeys, setActiveKeys] = useState([]);
  const [shiftOn, setShiftOn] = useState(false);

  const updateKeyboardState = (newValue) => {
    setKeyboardText(prevState => ({
      ...prevState,
      fields: {
        ...prevState.fields,
        [keyboardText.lastActiveField]: newValue
      }
    }));
  }

  const keyOn = (key, key2) => {
    if (!(activeKeys.includes(key))) {
      setActiveKeys([...activeKeys, key]);
    }

    if (key.includes('shift')) {
      setShiftOn(true);
    }

    updateKeyboardState(key, key2);

    if (key === 'backspace') {
      updateKeyboardState(
        keyboardText.fields[keyboardText.lastActiveField].substring(
          0, keyboardText.fields[keyboardText.lastActiveField].length - 1));
    } else {
      updateKeyboardState(shiftOn
        ? (keyboardText.fields[keyboardText.lastActiveField] || '') + key2
        : (keyboardText.fields[keyboardText.lastActiveField] || '') + key);
    }
  }

  const keyOff = (key) => {
    clearTimeout(cleanUpTimeout);

    setTimeout(() => {
      setActiveKeys(activeKeys.filter(keyActive => keyActive !== key));

      if (key.includes('shift')) {
        setShiftOn(false);
      }
    }, 100);

    cleanUpTimeout = setTimeout(() => {
      setActiveKeys([]);
    }, 1000);
  }

  useEffect(() => {
    // prevent right click due to taps registering it
    document.querySelector('.WebKeyboard').addEventListener('contextmenu', event => event.preventDefault());
  }, [])

  return (
    <div className="WebKeyboard">
      {keyboardRows.map((rowKeys, rowIndex) => {
        return <div key={rowIndex} className="WebKeyboard__row">
          {rowKeys.map((keyInfo, keyIndex) => {
            const rowKey = keyInfo.vals[0];

            return <div
              key={keyIndex}
              className={`WebKeyboard__row-key ${keyInfo?.class || ''} ${activeKeys.includes(rowKey) ? 'active' : ''}`}
              onTouchStart={() => keyOn(rowKey, keyInfo.vals.length > 1 ? keyInfo.vals[1] : '')}
              onTouchEnd={() => keyOff(rowKey)}
              style={{
                
              }}
            >
              <div className="WebKeyboard__display-key">{keyInfo?.alt || rowKey}</div>
              {keyInfo.vals.length > 1 && <div className="WebKeyboard__display-key-alts">{keyInfo.vals[1]}</div>}
            </div>
          })}
        </div>
      })}
    </div>
  );
}

export default WebKeyboard;
