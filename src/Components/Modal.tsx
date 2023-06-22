import { useState } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  showModal: boolean;
  onClose: () => void;
  toolInputs: { type: string; details: { label: string; type: string }[] };
  draw: any;
};

function Modal(props: ModalProps) {
  const [inputVals, setInputVals] = useState({});
  if (!props.showModal) return <></>;

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;

    let obj: { [key: string]: string } = inputVals;
    obj[name] = value;
    setInputVals(obj);
  };

  const handleSubmit = () => {
    // Set validation here
    props.draw({type: props.toolInputs.type, details: {...inputVals}});
    props.onClose();
  };

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="overlay"></div>
      <div className="modal-content">
        <div className="modal-header">
          <p>Enter the Input values</p>
          <button onClick={props.onClose}>X</button>
        </div>
        <div className="modal-body">
          {(props.toolInputs.details || []).map((input: any, key: any) => {
            return (
              <div className="form-control" key={key}>
                <label htmlFor={input.name}>{input['label']} :</label>
                <input type={input['type']} name={input.name} onChange={handleChange} required={true} />
              </div>
            );
          })}
        </div>
        <div className="modal-footer">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
}

export default Modal;
