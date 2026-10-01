import React from 'react';
import './BookingModal.css';

const BookingModal = ({ quest, onClose }) => {
  if (!quest) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{quest.title}</h2>
        <p className="modal-genre">{quest.genre}</p>
        <p className="modal-desc">{quest.description}</p>
        <div className="modal-info">
          <p><strong>Длительность:</strong> {quest.duration}</p>
          <p><strong>Команда:</strong> {quest.players}</p>
          <p><strong>Стоимость:</strong> {quest.price} BYN</p>
        </div>
        <button className="confirm-btn" onClick={() => { alert('Квест успешно забронирован!'); onClose(); }}>
          Подтвердить бронирование
        </button>
      </div>
    </div>
  );
};

export default BookingModal;