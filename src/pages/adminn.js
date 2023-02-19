import "../styles/coordinatorStyles/supplier.css";
import "../styles/coordinatorStyles/admin.css";
import "../styles/coordinatorStyles/admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { user } from "../constants/images";
import Dashboard from "../components/dashboard";

const baseUrl = "http://localhost:8080/admin";

export default (props) => {
  const users = [
    {
      active: false,
      firstName: "natty ",
      lastName: "fekadu",
      date: "jan 5 2023",
      accountId: 12,
      role: "phamacist ",
      email: "natty@gmail.com",
      fullName: "natty fekadu ",
      password: "123",
    },
    {
      active: false,
      firstName: "natty ",
      lastName: "fekadu",
      date: "jan 5 2023",
      accountId: 12,
      role: "phamacist ",
      email: "natty@gmail.com",
      fullName: "natty fekadu ",
      password: "123",
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
      password: "123",
    },
    {
      active: true,
      firstName: "seni",
      lastName: "alemayehu ",
      date: "jan 5 2023",
      accountId: 12,
      role: " coordinator",
      email: "natty@gmail.com",
      fullName: "seni alemayehu",
      password: "123",
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
      password: "123",
    },
  ];
  const adminAccount = {
    firstName: "admin ",
    lastName: "user",
    date: "jan 5 2023",
    accountId: 12,
    role: "system admin ",
    email: "admin@gmail.com",
    fullName: "admin user",
    password: "123",
  };

  const [editing, setEditing] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState();

  const [userAccount, setUserAccount] = useState(users);
  const [change, setChange] = useState(0);

  // ------------------------
  const [currentSlide, setCurrentSlide] = useState("list");

  // useEffect(() => {
  //   let drugsFetched = [];
  //   axios.get(`${baseUrl}/index`).then((response) => {
  //     console.log(response);
  //   });
  // }, []);

  const OnCreateUser = () => {
    setCurrentSlide("add");
  };
  const onAccountList = () => {
    setCurrentSlide("list");
  };
  const onUpdateAdmin = () => {
    setCurrentSlide("editAdmin");
  };

  const SlideContent = (props) => {
    let timer;
    const [formError, setFormError] = useState(false);
    const [formErrorMsg, setFormErrorMsg] = useState("");

    const UserCard = (props) => {
      const handleOnDetail = () => {
        setSelectedIndex(props.index);
        setCurrentSlide("detail");
      };
      const handleOnDelete = () => {
        userAccount.splice(props.index, 1);
        console.log(userAccount.length);
        setUserAccount(userAccount);
        setChange(change + 1);
      };
      const handleOnSetState = () => {
        let active = userAccount[props.index].active;
        userAccount[props.index].active = !active;
        setEditing(editing + 1);
      };

      return (
        <div className="user">
          <div className="user_image">
            <img src={user} />
          </div>
          <div className="user_text">
            <div className="text_left text_part">
              <div className=" user_name">{props.account.firstName}</div>{" "}
              <div className=" user_role"> {props.account.role}</div>
            </div>

            <div className="text_middle text_part">
              <div
                className=" user_btn user_btn-detail"
                onClick={handleOnDetail}>
                detail
              </div>{" "}
              <div
                className=" user_btn  user_btn-delete"
                onClick={handleOnDelete}>
                delete
              </div>
            </div>
            <div className="text_right text_part">
              {" "}
              <div className=" user_state">
                {" "}
                {props.account.active ? "acitve" : "inactive"}
              </div>
              <button
                className="btn  user_btn user_btn-state"
                onClick={handleOnSetState}>
                {props.account.active ? "deactivate" : "activate"}
              </button>
            </div>
          </div>
        </div>
      );
    };
    const AccountDetail = (props) => {
      let account = userAccount[selectedIndex];

      const handleOnDelete = () => {
        userAccount.splice(selectedIndex, 1);
        console.log(userAccount.length);
        setUserAccount(userAccount);
        setChange(change + 1);
        setCurrentSlide("list");
      };
      const handleOnSetState = () => {
        account.active = !account.active;
        setChange(change + 1);
      };
      const handleOnCloseDetail = () => {
        setCurrentSlide("list");
      };
      const handleOnUpdate = () => {
        setCurrentSlide("edit");
      };

      const [active, setActive] = useState(true);
      const hadleClick = () => {
        setActive(!active);
        // props.account.active = !props.account.active;
      };
      const handleClose = () => {
        props.handleDetailVisiblity(false, props.index, false, true);
      };
      if (currentSlide != "detail") return null;
      return (
        <div className="account_detail ">
          <div className="detail_header">
            <button
              className="close "
              onClick={handleOnCloseDetail}>
              X
            </button>{" "}
            <p
              className={`${
                account.active ? "active" : "inactive"
              } account_state`}>
              {`${account.active ? "active" : "inactive"}`}
            </p>
          </div>
          <div className="detail_header-sub">
            <div className="detail_image">
              <img
                src={user}
                alt="userimage"
              />
            </div>
            <button
              className="btn  btn_deactive"
              onClick={handleOnSetState}>{`${
              account.active ? "deactivate" : "activate"
            }`}</button>
          </div>
          <div className="detail_text">
            <p className="detail f_name">
              <span className="key key-fname">first name</span>
              <span className="value value-fname">{account.firstName}</span>
            </p>
            <p className="detail l_name">
              <span className="key key-lname">last name</span>
              <span className="value value-lname">{account.lastName} </span>
            </p>

            <p className="detail email">
              <span className="key key-email">email/phone no.</span>
              <span className="value value-email">{account.email}</span>
            </p>
            <p className="detail role">
              <span className="key key-role">role</span>
              <span className="value value-email">{account.role} </span>
            </p>
            <p className="detail date_assigned">
              <span className="key key-date">assigned date</span>
              <span className="value value-date">{account.date}</span>
            </p>
          </div>
          <div className="detail_btns">
            <button
              className="btn btn_update"
              onClick={handleOnUpdate}>
              update
            </button>
            <button
              className="btn btn_delete"
              onClick={handleOnDelete}>
              delete
            </button>
          </div>
        </div>
      );
    };
    const CreateUser = (props) => {
      let timer;
      const handleOnCreateEditUser = () => {
        const fNameInput = document.querySelector(".input-fname");
        const lNameInput = document.querySelector(".input-lname");
        const emailInput = document.querySelector(".input-email");
        const roleInput = document.querySelector(".input-role");
        const passwordInput = document.querySelector(".input-password");
        const cPasswordInput = document.querySelector(".input-c_password");

        const fName = fNameInput.value;
        const lName = lNameInput.value;
        const email = emailInput.value;
        const role = roleInput.value;
        const password = passwordInput.value;
        const cPassword = cPasswordInput.value;

        {
          //validation

          if (
            fName == "" ||
            lName == "" ||
            email == "" ||
            role == "" ||
            password == "" ||
            cPassword == ""
          ) {
            setFormErrorMsg("Input can not be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout((e) => {
              setFormError(false);
            }, 2000);
            return;
          }

          if (password != cPassword) {
            setFormErrorMsg("password mismatch   !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout((e) => {
              setFormError(false);
            }, 2000);
            return;
          }
        }

        if (currentSlide == "add") {
          const userCreated = {
            active: true,
            firstName: fName,
            lastName: lName,
            date: "jan 5 2023",
            accountId: 45,
            role: role,
            email: email,
            fullName: `${fName} {lName}`,
            password: password,
          };
          userAccount.push(userCreated);
          setUserAccount(userAccount);
          setChange(change + 1);
          setCurrentSlide("list");
        }
        if (currentSlide == "edit") {
          account.firstName = fName;
          account.lastName = lName;
          account.role = role;
          account.email = email;
          account.password = password;
          account.fullName = `${fName} {lName}`;
          setChange(change + 1);
          setCurrentSlide("list");
        }
        if (currentSlide == "editAdmin") {
          adminAccount.firstName = fName;
          adminAccount.lastName = lName;
          adminAccount.role = role;
          adminAccount.email = email;
          adminAccount.password = password;
          adminAccount.fullName = `${fName} {lName}`;
          setChange(change + 1);
          setCurrentSlide("list");
        }
      };
      const handleOnCloseForm = () => {
        if (currentSlide == "add") setCurrentSlide("list");
        if (currentSlide == "editAdmin") setCurrentSlide("list");
        if (currentSlide == "edit") setCurrentSlide("detail");
      };

      let account;
      if (currentSlide == "add") {
        account = {
          active: true,
          firstName: "",
          lastName: "",
          date: "",
          accountId: 12,
          role: "",
          email: "",
          fullName: "",
          password: "",
        };
      }
      if (currentSlide == "edit") account = userAccount[selectedIndex];
      if (currentSlide == "editAdmin") account = adminAccount;
      if (
        !(
          currentSlide == "add" ||
          currentSlide == "edit" ||
          currentSlide == "editAdmin"
        )
      )
        return null;
      let formTitle;
      let btnValue;

      if (currentSlide == "add") {
        formTitle = "add user account ";
        btnValue = "create user";
      }
      if (currentSlide == "edit") {
        formTitle = "edit  user account ";
        btnValue = "edit  user";
      }
      if (currentSlide == "editAdmin") {
        formTitle = "add admin account ";
        btnValue = "update admin ";
      }

      return (
        <div class="account_form ">
          <div class="form">
            <h1 class="title">{formTitle}</h1>
            <button
              className="close close_form"
              onClick={handleOnCloseForm}>
              X
            </button>
            <div
              className={`form_error ${formError ? "form_error-visible" : ""}`}>
              {formErrorMsg}
            </div>
            <div className="form_row form_row-account">
              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-fname"
                  placeholder="a"
                  defaultValue={account.firstName}
                />
                <label
                  htmlFor=""
                  class="label">
                  first Name
                </label>
              </div>

              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-lname"
                  placeholder="a"
                  defaultValue={account.lastName}
                />
                <label
                  htmlFor=""
                  class="label">
                  last name
                </label>
              </div>
            </div>
            <div className="form_row form_row-account">
              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-email "
                  placeholder="a"
                  defaultValue={account.email}
                />
                <label
                  htmlFor=""
                  class="label">
                  email
                </label>
              </div>

              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-role"
                  placeholder="a"
                  defaultValue={account.role}
                />
                <label
                  htmlFor=""
                  class="label">
                  user role
                </label>
              </div>
            </div>
            <div className="form_row form_row-account">
              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-password"
                  placeholder="a"
                  defaultValue={account.password}
                />

                <label
                  htmlFor=""
                  class="label">
                  password
                </label>
              </div>

              <div class="inputContainer inputContainer-account">
                <input
                  type="text"
                  class="input input-c_password"
                  placeholder="a"
                />
                <label
                  htmlFor=""
                  class="label">
                  confirm password
                </label>
              </div>
            </div>
            <button
              className="btn btn_create"
              onClick={handleOnCreateEditUser}>
              {btnValue}
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="users users_blurred ">
        <h1 className="slide_header">
          {currentSlide != "list" ? "" : "user accounts"}
        </h1>
        {userAccount.length == 0 ? (
          <h1 className="no_data_header">no user account is added yet </h1>
        ) : (
          <div className="users_main">
            <AccountDetail />
            <CreateUser />
            <div
              className={`users_list ${
                currentSlide != "list" ? "user_list-blurred" : ""
              }`}>
              {userAccount.map((account, index) => (
                <UserCard
                  index={index}
                  key={index}
                  account={account}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="whole_page coordinator_page">
      <Dashboard
        user="admin"
        onAccountList={onAccountList}
        OnCreateUser={OnCreateUser}
        currentSlide={currentSlide}
        onUpdateAdmin={onUpdateAdmin}
      />
      <div className="main_page">
        <div className="page_slide">
          <SlideContent />
        </div>
      </div>
    </div>
  );
};
