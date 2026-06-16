const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: 'bi-check-circle-fill',
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div className={`alert alert-${type} alert-dismissible d-flex align-items-center gap-2 fade show`} role="alert">
      <i className={`bi ${icons[type]} flex-shrink-0`}></i>
      <span>{message}</span>
      {onClose && (
        <button type="button" className="btn-close ms-auto" onClick={onClose} />
      )}
    </div>
  );
};

export default Alert;
