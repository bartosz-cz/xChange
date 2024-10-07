import IconButton from "../shared/IconButton";

var classnames = require("classnames");

export default function PopUp({ popUp, setPopUp }) {
  const handleApprove = () => {
    if (popUp.handler) {
      popUp.handler();
      setPopUp((prevSettings) => ({ ...prevSettings, visible: false }));
    } else {
      console.error("Handler is undefined");
    }
  };
  const handleCancel = () => {
    setPopUp((prevSettings) => ({ ...prevSettings, visible: false }));
  };

  return (
    <div
      className={classnames(
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "ApproveBackground",
        { "d-none": !popUp.visible }
      )}
    >
      <div className="d-flex flex-column innerWindow justify-content-start align-items-center">
        <div className="d-flex textS1Dark justify-content-center align-items-center">
          {popUp.content}
        </div>
        <div className="d-flex" style={{ height: 20 }}></div>
        <div className="d-flex flex-row">
          <IconButton
            name={"Cancel"}
            styleClass={"buttonDark"}
            onClick={handleCancel}
          ></IconButton>
          <div className="d-flex" style={{ width: 20 }}></div>
          <IconButton
            name={"Approve"}
            styleClass={"buttonDark"}
            onClick={handleApprove}
          ></IconButton>
        </div>
      </div>
    </div>
  );
}
