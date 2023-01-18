import "../../styles/adminStyles/account.css";
export default (props) => {
  const handleMouseEnter = () => {
    props.handleDetailVisiblity(true, props.index, props.detailSelected, false);
  };
  const handleMouseLeave = () => {
    props.handleDetailVisiblity(
      false,
      props.index,
      props.detailSelected,
      false
    );
  };
  const handleClick = () => {
    props.handleDetailVisiblity(props.visibility, props.index, true, true);
  };
  return (
    <div
      onClick={handleClick}
      className={`${
        props.index == props.detailIndex ? "account selected" : "account"
      } ${
        props.index == props.detailIndex && props.detailSelected
          ? "account selectedd"
          : "account"
      }`}
      onMouseEnter={handleMouseEnter}>
      <p className="name account-data">{props.fullName}</p>
      <p className="role account-data">{props.role}</p>
    </div>
  );
};
