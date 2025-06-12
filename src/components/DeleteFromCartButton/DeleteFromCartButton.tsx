import React from 'react';
import TrashImg from '../../assets/trash.png';

export const DeleteFromCartButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (
  props
) => {
  return (
    <button {...props} className="delete-from-cart-button" type="button">
      <img className="delete-image" src={TrashImg} alt="Delete" />
    </button>
  );
};
