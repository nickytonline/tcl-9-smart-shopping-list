import React, { useContext, useState, useEffect } from 'react';
import firebase from 'firebase';
import NavLinks from './NavLinks';
import { ItemsContext } from './ItemsContext';

const List = () => {
  console.log('render');
  const { items } = useContext(ItemsContext);
  const [searchTerm, setTerm] = useState('');
  const [filteredItems, setfilteredItems] = useState(items);
  useEffect(() => {
    setfilteredItems(items);
  }, [items]);
  const oneDayInMilliSecond = 1000 * 60 * 60 * 24;

  const now = new Date(Date.now());

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

    setfilteredItems(filterItems);
  };
  // if (items.length === 0) {
  //   return <span>Your list is empty! Please add an item.</span>;
  // }

  return (
    <div>
      <h1>Items</h1>
      <input type="search" value={searchTerm} onChange={handleSearch}></input>
      {items.length === 0 ? (
        <span>Your list is empty! Please add an item.</span>
      ) : filteredItems.length === 0 ? (
        <span>There's no match for {searchTerm}.</span>
      ) : (
        <ul>
          {filteredItems.map(item => (
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
