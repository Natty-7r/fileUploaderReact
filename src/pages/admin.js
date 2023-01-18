import "../styles/adminStyles/admin.css";
import Header from "../components/adminComponents/header";
import AccountList from "../components/adminComponents/accountList";
import { useState } from "react";
import AccountDetail from "../components/adminComponents/accountDetail";

const userAccount = [
  {
    active: false,
    firstName: "natty ",
    lastName: "fekadu",
    date: "jan 5 2023",
    accountId: 12,
    role: "phamacist ",
    email: "natty@gmail.com",
    fullName: "natty fekadu ",
  },
  {
    active: true,
    firstName: "wubshet",
    lastName: "bezabih ",
    date: "jan 5 2023",
    accountId: 12,
    role: "manaer ",
    email: "natty@gmail.com",
    fullName: "wubshet bezabih ",
  },
  {
    active: true,
    firstName: "seni",
    lastName: "alemayehu ",
    date: "jan 5 2023",
    accountId: 12,
    role: "store coordinator",
    email: "natty@gmail.com",
    fullName: "seni alemayehu",
  },
  {
    active: true,
    firstName: "yabsira ",
    lastName: "fekadu",
    date: "jan 5 2023",
    accountId: 12,
    role: "casher",
    email: "natty@gmail.com",
    fullName: "yabsira fekadu",
  },
];
export { userAccount };

export default () => {
  const [detailVisibility, setDetailVisibility] = useState(true);
  const [detailIndex, setDetailIndex] = useState(0);
  const [detailSelected, setDetailSelection] = useState(false);

  const handleDetailVisiblity = (visibility, index, selection, isSelection) => {
    if (detailSelected && !isSelection) return;
    setDetailIndex(index);
    setDetailVisibility(visibility);
    setDetailSelection(selection);
  };

  return (
    <div className="admin_page">
      <div className="main">
        <AccountList
          userAccount={userAccount}
          detailVisibility={detailVisibility}
          handleDetailVisiblity={handleDetailVisiblity}
          detailSelected={detailSelected}
          visibility={detailVisibility}
          detailIndex={detailIndex}
        />
        <AccountDetail
          handleDetailVisiblity={handleDetailVisiblity}
          detailSelected={detailSelected}
          visibility={detailVisibility}
          detailIndex={detailIndex}
          account={{ ...userAccount[detailIndex] }}
        />
      </div>
    </div>
  );
};
