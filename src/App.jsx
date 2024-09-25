import React, { useState } from 'react';
import './App.scss';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    cat => cat.id === product.categoryId,
  );
  const user = usersFromServer.find(u => u.id === category?.ownerId);

  return { ...product, category, user };
});

export const App = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');

  const resetAllFilters = () => {
    setQuery('');
    setUserId(0);
  };

  let filteredProducts = [...products];

  if (userId) {
    filteredProducts = filteredProducts.filter(
      product => product.user?.id === userId,
    );
  }

  if (query) {
    const lowerQuery = query.toLowerCase();

    filteredProducts = filteredProducts.filter(product =>
      // eslint-disable-next-line prettier/prettier
      product.name.toLowerCase().includes(lowerQuery));
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Products</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filter by User</p>

            <p className="panel-tabs">
              <a
                href="#/"
                className={userId === 0 ? 'is-active' : ''}
                onClick={() => setUserId(0)}
              >
                All Users
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={userId === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="search"
                  className="input"
                  placeholder="Search products"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>
                {query && (
                  <span className="icon is-right">
                    <button
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetAllFilters}
              >
                Clear Filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {filteredProducts.length === 0 ? (
            <p>No results found</p>
          ) : (
            <table className="table is-striped is-narrow is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Owner</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>
                    <td
                      className={
                        product.user?.gender === 'male'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {product.user?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
