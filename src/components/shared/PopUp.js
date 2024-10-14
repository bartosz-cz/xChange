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
      className={classnames("center", "popUpBlur", {
        "d-none": !popUp.visible,
      })}
    >
      <div className="popUpContainer">
        <div className="center textDark">{popUp.content}</div>
        <div className="d-flex" style={{ height: 20 }}></div>
        <div className="flexRow">
          <IconButton
            name={"Cancel"}
            styleClass={"buttonDark"}
            onClick={handleCancel}
            btnWidth={60}
            btnHeight={50}
            borderRadius="45px"
          ></IconButton>
          <div className="d-flex" style={{ width: 20 }}></div>
          <IconButton
            name={"Approve"}
            styleClass={"buttonDark"}
            onClick={handleApprove}
            btnWidth={60}
            btnHeight={50}
            borderRadius="45px"
          ></IconButton>
        </div>
      </div>
    </div>
  );
}
