export default (props) => {
  return (
    <div className="overview">
      <div className="summary">
        <p className="summary_name">
          total drugs in {props.user == "coordinator" ? "store" : "stock"}{" "}
        </p>
        <p className="summary_value">{props.summary[0]}</p>
      </div>
      <div className="summary">
        <p className="summary_name">availbles drugs </p>
        <p className="summary_value">{props.summary[1]}</p>
      </div>
      <div className="summary">
        <p className="summary_name">expired drugs </p>
        <p className="summary_value">{props.summary[2]}</p>
      </div>
      <div className="summary">
        <p className="summary_name">pending drugs </p>
        <p className="summary_value">{props.summary[3]}</p>
      </div>
      {props.stockRequests ? (
        <div className="summary">
          <p className="summary_name">stock requests </p>
          <p className="summary_value">{props.summary[4]}</p>
        </div>
      ) : null}
    </div>
  );
};
