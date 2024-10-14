const FlashMessage = ({ message }) => {
  if (!message) return null;

  return (
      <div style={{ backgroundColor: '#dff0d8', color: '#3c763d', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
          {message}
      </div>
  );
};

export default FlashMessage;