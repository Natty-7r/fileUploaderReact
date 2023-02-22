export default (props) => {
  if (props.user == "manager")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">total drugs in store</p>
          <p className="summary_value">{props.summary[0]}</p>
        </div>
        <div className="summary">
          <p className="summary_name"> total drugs in stock </p>
          <p className="summary_value">{props.summary[1]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">sold drugs </p>
          <p className="summary_value">{props.summary[2]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">store orders </p>
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
  if (props.user == "casher")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">unbilled drugs </p>
          <p className="summary_value">{props.summary[0]}</p>
        </div>
        <div className="summary">
          <p className="summary_name"> drugs sold today </p>
          <p className="summary_value">{props.summary[1]}</p>
        </div>
      </div>
    );
  if (props.user == "coordinator")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">total drugs in store</p>
          <p className="summary_value">{props.summary[0]}</p>
        </div>
        <div className="summary">
          <p className="summary_name"> total drugs in stock </p>
          <p className="summary_value">{props.summary[1]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">expred drugs </p>
          <p className="summary_value">{props.summary[2]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">unregisterd drugs </p>
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
  if (props.user == "pharmacist")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">total drugs in stock</p>
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
      </div>
    );
  if (props.user == "supplier")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">total drugs ordered</p>
          <p className="summary_value">{props.summary[0]}</p>
        </div>
        <div className="summary">
          <p className="summary_name"> types of drugs ordered </p>
          <p className="summary_value">{props.summary[1]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">accepted orders </p>
          <p className="summary_value">{props.summary[2]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">rejected oreders </p>
          <p className="summary_value">{props.summary[3]}</p>
        </div>
      </div>
    );
  if (props.user == "admin")
    return (
      <div className="overview">
        <div className="summary">
          <p className="summary_name">total accounts</p>
          <p className="summary_value">{props.summary[0]}</p>
        </div>
        <div className="summary">
          <p className="summary_name"> active accounts </p>
          <p className="summary_value">{props.summary[1]}</p>
        </div>
        <div className="summary">
          <p className="summary_name">inActive accounts </p>
          <p className="summary_value">{props.summary[2]}</p>
        </div>
      </div>
    );
};
