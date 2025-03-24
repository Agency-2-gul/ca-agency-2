import React from 'react';
import useFetch from '../../hooks/useFetch';

const RenderHome = () => {
  const { data, loading, error } = useFetch(
    `https://kassal.app/api/v1/products`
  );
  if (data) {
    console.log(data);
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Her skjedde det noe rart... {error}</p>;
  }

  return (
    <div>
      {data ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>No data</p>
      )}
    </div>
  );
};

export default RenderHome;
