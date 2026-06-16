const Spinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  return (
    <div className="d-flex align-items-center justify-content-center gap-2">
      <div className={`spinner-border text-primary ${sizeClass}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="text-muted">{text}</span>}
    </div>
  );
};

export default Spinner;
