import React from 'react';

import './UpvoteCount.scss';

interface Props {
  votes: number;
}

function UpvoteCount({ votes }: Props): JSX.Element {
  return (
    <div className="upvote-count">
      <div className="star-icon">
        <i className="fas fa-star" aria-hidden="true" />
        <span className="star-shadow" />
      </div>
      <div className="star-count">{votes}</div>
    </div>
  );
}

export default UpvoteCount;
