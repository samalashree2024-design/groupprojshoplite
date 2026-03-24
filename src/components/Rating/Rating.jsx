import React from 'react';
import { MdStar, MdStarBorder } from 'react-icons/md';
import './Rating.css';

function Rating({ rating }) {
    return (
        <div className="rating">
            {Array(5)
                .fill()
                .map((_, i) => (
                    <span key={i}>
                        {i < Math.floor(rating) ? (
                            <MdStar className="rating__star" />
                        ) : (
                            <MdStarBorder className="rating__star" />
                        )}
                    </span>
                ))}
        </div>
    );
}

export default Rating;
