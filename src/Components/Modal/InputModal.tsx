import ReactDom from 'react-dom';
import './modal-stylesheet.css';

function Modal(props: any) {
  if (!props.show) return null;

  return ReactDom.createPortal(
    <div className="modal">
      <div className="overlay"></div>
      <div className="modalContent">
        <div className="modalHeader">
        </div>
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
}

export default Modal;
