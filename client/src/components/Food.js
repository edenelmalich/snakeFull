import React from 'react';
import apple from '../img/apple.png';

const Food = props => {
  const { food } = props;
  const style = {
    left: `${food[0]}%`,
    top: `${food[1]}%`
  };
  return <img src={apple} className='Food' style={style} alt='food' />;
};
export default Food;
