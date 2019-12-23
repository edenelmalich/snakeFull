import React, { Fragment } from 'react';

const Obstacles = props => {
  const { obstacle, top } = props;
  return (
    <Fragment>
      {obstacle.map((dot, i) => {
        const style = {
          left: `${top}%`,
          top: `${dot}%`
        };
        return <div className='Obstacle-cord' key={i} style={style}></div>;
      })}
    </Fragment>
  );
};
export default Obstacles;
