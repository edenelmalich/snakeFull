import React from 'react';
import poisonApple from '../img/poison.png';

const Poison = props => {
  const { poison } = props;
  const style = {
    left: `${poison[0]}%`,
    top: `${poison[1]}%`
  };
  return (
    <img src={poisonApple} className='Poison' style={style} alt='poison' />
  );
};
export default Poison;
