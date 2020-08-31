import React, { useContext, useState } from 'react';
import firebase from 'firebase';
import NavLinks from './NavLinks';
import { ItemsContext } from './ItemsContext';

const List = () => {
  const { items } = useContext(ItemsContext);
  const [searchTerm, setTerm] = useState('');
  const oneDayInMilliSecond = 1000 * 60 * 60 * 24;

  const now = new Date(Date.now());

  let emptyList = false;

  if (items.length === 0) {
    emptyList = true;
  }

  const handleChange = async e => {
    const newData = { lastPurchased: Date.now() };
    const db = firebase.firestore();

    const itemRef = db.collection('items').doc(e.target.id);
    itemRef.update(newData);
  };

  const handleSearch = e => {
    setTerm(e.target.value);
    const filterItems = items.filter(item => {
      return item.name.includes(e.target.value);
    });
    console.log(filterItems);
  };

  return (
    <div>
      <h1>Items</h1>
      <input type="text" value={searchTerm} onChange={handleSearch}></input>
      {emptyList ? (
        <span>Your list is empty! Please add an item.</span>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <input
                type="checkbox"
                onChange={handleChange}
                id={item.id}
                checked={
                  (item.lastPurchased &&
                    now < item.lastPurchased + oneDayInMilliSecond) ||
                  false
                }
                disabled={
                  item.lastPurchased &&
                  now < item.lastPurchased + oneDayInMilliSecond
                }
              ></input>
              {item.name}
            </li>
          ))}
        </ul>
      )}
      <NavLinks />
    </div>
  );
};

export default List;
