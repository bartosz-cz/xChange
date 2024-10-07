import IconButton from "../ui/IconButton";

var classnames = require("classnames");

export default function ApproveWindow({ settings, setSettings }) {
  const handleApprove = () => {
    console.log(settings);

    if (settings.handler) {
      settings.handler();
      setSettings((prevSettings) => ({ ...prevSettings, visible: false }));
    } else {
      console.error("Handler is undefined");
    }
  };
  const handleCancel = () => {
    setSettings((prevSettings) => ({ ...prevSettings, visible: false }));
  };

  return (
    <div
      className={classnames(
        "d-flex",
        "justify-content-center",
        "align-items-center",
        "ApproveBackground",
        { "d-none": !settings.visible }
      )}
    >
      <div className="d-flex flex-column innerWindow justify-content-start align-items-center">
        <div className="d-flex textS1Dark justify-content-center align-items-center">
          {settings.content}
        </div>
        <div className="d-flex" style={{ height: 20 }}></div>
        <div className="d-flex flex-row">
          <IconButton
            name={"Cancel"}
            tooltipText={"Decline"}
            styleClass={"buttonDark"}
            activeStyleClass={"buttonActive"}
            onClick={handleCancel}
            size={32}
          ></IconButton>
          <div className="d-flex" style={{ width: 20 }}></div>
          <IconButton
            name={"Approve"}
            tooltipText={"Approve"}
            styleClass={"buttonDark"}
            activeStyleClass={"buttonActive"}
            onClick={handleApprove}
            size={32}
          ></IconButton>
        </div>
      </div>
    </div>
  );
}
