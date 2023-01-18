import Account from "./account";

export default (props) => {
  return (
    <div className="account_list">
      {props.userAccount.map((account, index) => (
        <Account
          detailVisibility={props.detailVisibility}
          handleDetailVisiblity={props.handleDetailVisiblity}
          detailSelected={props.detailSelected}
          visibility={props.visibility}
          key={index}
          index={index}
          detailIndex={props.detailIndex}
          {...account}
        />
      ))}
    </div>
  );
};
