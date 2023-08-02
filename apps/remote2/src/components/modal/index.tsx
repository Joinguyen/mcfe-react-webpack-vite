import "./index.scss";
import { modalType } from "@/types/components.type";

function Modal({ header, content, footer, modalBox }: modalType) {
  return (
    <div className="modal_wrap">
      {modalBox ? (
        modalBox
      ) : (
        <div className="modal_box">
          {header && <div className="modal_box_header">{header}</div>}

          {content && <div className="modal_box_content">{content}</div>}

          {footer && <div className="modal_box_footer">{footer}</div>}
        </div>
      )}
    </div>
  );
}

export default Modal;
