import React, { Fragment } from 'react';

const Snake = props => {
  const { snake, bg } = props;
  return (
    <Fragment>
      {snake.map((dot, i) => {
        const style = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`,
          background: bg
        };
        return <div className='Snake-cord ' key={i} style={style}></div>;
      })}
    </Fragment>
  );
};
export default Snake;
