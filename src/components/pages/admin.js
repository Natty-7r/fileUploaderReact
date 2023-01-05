import "./admin.css";

export default () => {
  return (
    <div>
      <Header />
      <div className="main">
        <div className="accounts_container">
          <AccountDetail />
          <Account />
        </div>
      </div>
    </div>
  );
};
const Header = () => {
  return (
    <header className="header">
      <div className="header_left">
        <p className="logo">
          <img
            src="./logo.jpg "
            alt="logo"
          />
        </p>
        <h2 className="name">fancy things going</h2>
      </div>
      <div className="header_right">
        <button className="btn btn_logout">logout</button>
      </div>
    </header>
  );
};
const Account = () => {
  return (
    <div className="account">
      <div className="account-text">
        <p className="name">aurthur shelby</p>
        <p className="role">student</p>
        <button className="btn btn_detail">detail</button>
      </div>
    </div>
  );
};
const AccountDetail = () => {
  return (
    <div class="account_detail hidden">
      <p class="account_state active ">active</p>
      <p class="close ">X</p>
      <div class="detail_image">
        <img
          src="./user-2.jpg"
          alt="userimage"
        />
      </div>
      <div class="detail_text">
        <p class="detail f_name">
          <span class="key key-fname">first name</span>
          <span class="value value-fname">authur</span>
        </p>
        <p class="detail l_name">
          <span class="key key-lname">last name</span>
          <span class="value value-lname">shelby </span>
        </p>

        <p class="detail email">
          <span class="key key-email">email/phone no.</span>
          <span class="value value-email">authr@gmail.com</span>
        </p>
        <p class="detail role">
          <span class="key key-role">role</span>
          <span class="value value-email">student </span>
        </p>
        <p class="detail date_assigned">
          <span class="key key-date">assigned date</span>
          <span class="value value-date">jan5 2023 </span>
        </p>
      </div>
      <div class="detail_btns">
        <button class="btn btn_deactive">deactivate</button>
        <button class="btn btn_delete">delete</button>
      </div>
    </div>
  );
};
