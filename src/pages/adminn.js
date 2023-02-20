import "../styles/coordinatorStyles/supplier.css";
import "../styles/coordinatorStyles/admin.css";
import "../styles/coordinatorStyles/admin.css";
import axios from "axios";
import Select from "react-dropdown-select";
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
      username: "natty@gmail.com",
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
      username: "natty@gmail.com",
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
      username: "natty@gmail.com",
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
      username: "natty@gmail.com",
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
      username: "natty@gmail.com",
      fullName: "yabsira fekadu",
      password: "123",
    },
  ];
  // const adminAccount = {
  //   firstName: "admin ",
  //   lastName: "user",
  //   date: "jan 5 2023",
  //   accountId: 12,
  //   role: "system admin ",
  //   username: "admin@gmail.com",
  //   fullName: "admin user",
  //   password: "123",
  // };

  const [editing, setEditing] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState();

  const [userAccount, setUserAccount] = useState(users);
  const [adminAccount, setAdminAccount] = useState();
  const [change, setChange] = useState(0);

  const [currentSlide, setCurrentSlide] = useState("list");

  useEffect(() => {
    axios.get(`${baseUrl}/index`).then((response) => {
      console.log(response);
      setAdminAccount(response.data.accounts.adminAccount);
      setUserAccount(response.data.accounts.userAcccounts);
    });
  }, []);

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
        const accountIdToDelete = userAccount[props.index].accountId;
        axios
          .delete(`${baseUrl}/account/${accountIdToDelete}`)
          .then((response) => {
            const status = response.data.status;
            if (status == "success") {
              userAccount.splice(props.index, 1);
              setUserAccount(userAccount);
              setChange(change + 1);
            }
          });
      };
      const handleOnSetState = () => {
        let active = userAccount[props.index].active;
        axios
          .patch(`${baseUrl}/account`, {
            accountId: userAccount[props.index].accountId,
            active: !active,
          })
          .then((response) => {
            const status = response.data.status;
            if (status == "success") {
              userAccount[props.index].active = !active;
              setEditing(editing + 1);
            }
          });
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
        const accountIdToDelete = userAccount[selectedIndex].accountId;
        axios
          .delete(`${baseUrl}/account/${accountIdToDelete}`)
          .then((response) => {
            const status = response.data.status;
            if (status == "success") {
              userAccount.splice(selectedIndex, 1);
              setUserAccount(userAccount);
              setChange(change + 1);
              setCurrentSlide("list");
            }
          });
      };
      const handleOnSetState = () => {
        let active = account.active;
        axios
          .patch(`${baseUrl}/account`, {
            accountId: account.accountId,
            active: !active,
          })
          .then((response) => {
            const status = response.data.status;
            if (status == "success") {
              account.active = !account.active;
              setChange(change + 1);
            }
          });
      };
      const handleOnCloseDetail = () => {
        setCurrentSlide("list");
      };
      const handleOnUpdate = () => {
        setCurrentSlide("edit");
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

            <p className="detail username">
              <span className="key key-username">username/</span>
              <span className="value value-username">{account.username}</span>
            </p>
            <p className="detail role">
              <span className="key key-role">role</span>
              <span className="value value-username">{account.role} </span>
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
      const handleOnCreateEditUser = () => {
        const fNameInput = document.querySelector(".input-fname");
        const lNameInput = document.querySelector(".input-lname");
        const usernameInput = document.querySelector(".input-username");
        const roleInput = document.querySelector(".input-role");
        const passwordInput = document.querySelector(".input-password");
        const cPasswordInput = document.querySelector(".input-c_password");

        const fName = fNameInput.value;
        const lName = lNameInput.value;
        const username = usernameInput.value;
        const role = roleInput.value;
        const password = passwordInput.value;
        const cPassword = cPasswordInput.value;
        {
          //validation

          if (
            fName == "" ||
            lName == "" ||
            username == "" ||
            role == "" ||
            password == "" ||
            cPassword == ""
          ) {
            setFormErrorMsg("Input can not be empty  !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout((e) => {
              setFormError(false);
            }, 5000);
            return;
          }

          if (password != cPassword) {
            setFormErrorMsg("password mismatch   !");
            clearTimeout(timer);
            setFormError(true);
            timer = setTimeout((e) => {
              setFormError(false);
            }, 5000);
            return;
          }
        }
        {
          if (currentSlide == "add") {
            const userCreated = {
              active: true,
              firstName: fName,
              lastName: lName,
              date: new Date(),
              accountId: 45,
              role: role,
              username: username,
              fullName: `${fName} ${lName}`,
              password: password,
            };

            axios
              .post(`${baseUrl}/account`, {
                account: userCreated,
              })
              .then((response) => {
                const status = response.data.status;
                if (status == "fail") {
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                    fNameInput.value = fName;
                    lNameInput.value = lName;
                    roleInput.value = role;
                    usernameInput.value = username;
                    passwordInput.value = password;
                    cPasswordInput.value = cPassword;
                  }, 5000);
                  fNameInput.value = fName;
                  lNameInput.value = lName;
                  roleInput.value = role;
                  usernameInput.value = username;
                  passwordInput.value = password;
                  cPasswordInput.value = cPassword;
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                  }, 5000);
                  return;
                }
                if (status == "success") {
                  userAccount.push(response.data.userAcccount);
                  setUserAccount(userAccount);
                  setChange(change + 1);
                  setCurrentSlide("list");
                }
              });
          }
          if (currentSlide == "edit") {
            const accountToEdit = Object.assign({}, account);
            accountToEdit.firstName = fName;
            accountToEdit.lastName = lName;
            accountToEdit.role = role;
            accountToEdit.username = username;
            accountToEdit.password = password;
            accountToEdit.fullName = `${fName} ${lName}`;
            axios
              .put(`${baseUrl}/account`, {
                ...accountToEdit,
              })
              .then((response) => {
                const status = response.data.status;
                if (status == "fail") {
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                    fNameInput.value = fName;
                    lNameInput.value = lName;
                    roleInput.value = role;
                    usernameInput.value = username;
                    passwordInput.value = password;
                    cPasswordInput.value = cPassword;
                  }, 5000);
                  fNameInput.value = fName;
                  lNameInput.value = lName;
                  roleInput.value = role;
                  usernameInput.value = username;
                  passwordInput.value = password;
                  cPasswordInput.value = cPassword;
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                  }, 5000);
                  return;
                }
                if (status == "success") {
                  userAccount[selectedIndex] = accountToEdit;
                  setChange(change + 1);
                  setCurrentSlide("list");
                }
              });
          }
          if (currentSlide == "editAdmin") {
            const accountToEdit = Object.assign({}, adminAccount);
            accountToEdit.firstName = fName;
            accountToEdit.lastName = lName;
            accountToEdit.username = username;
            accountToEdit.password = password;
            accountToEdit.fullName = `${fName} ${lName}`;
            axios
              .put(`${baseUrl}/account`, {
                ...accountToEdit,
              })
              .then((response) => {
                const status = response.data.status;
                if (status == "fail") {
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                    fNameInput.value = fName;
                    lNameInput.value = lName;
                    roleInput.value = role;
                    usernameInput.value = username;
                    passwordInput.value = password;
                    cPasswordInput.value = cPassword;
                  }, 5000);
                  fNameInput.value = fName;
                  lNameInput.value = lName;
                  roleInput.value = role;
                  usernameInput.value = username;
                  passwordInput.value = password;
                  cPasswordInput.value = cPassword;
                  setFormErrorMsg(response.data.message);
                  clearTimeout(timer);
                  setFormError(true);
                  timer = setTimeout((e) => {
                    setFormError(false);
                  }, 5000);
                  return;
                }
                if (status == "success") {
                  setAdminAccount(accountToEdit);
                  setChange(change + 1);
                  setCurrentSlide("list");
                }
              });
          }
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
          username: "",
          fullName: "",
          password: "",
        };
      }
      if (currentSlide == "edit") account = userAccount[selectedIndex];
      if (currentSlide == "editAdmin") account = adminAccount;
      console.log(account);
      console.log(adminAccount);
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
                  class="input input-username "
                  placeholder="a"
                  defaultValue={account.username}
                />
                <label
                  htmlFor=""
                  class="label">
                  username
                </label>
              </div>

              <div class="inputContainer inputContainer-account">
                {currentSlide == "editAdmin" ? (
                  <input
                    className="input"
                    value="admin"
                    disabled
                  />
                ) : (
                  <select className="input input-role">
                    <option
                      disabled
                      value="phamacist"
                      selected>
                      phamacist
                    </option>
                    <option value="coordinator">coordinator</option>
                    <option value="cashier">cashier</option>
                    <option value="manager">manager</option>
                    <option value="supplier">supplier</option>
                  </select>
                )}
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

        <div className="users_main">
          <AccountDetail />
          <CreateUser />
          <div
            className={`users_list ${
              currentSlide != "list" ? "user_list-blurred" : ""
            }`}>
            {userAccount.length == 0 ? (
              <h1 className="no_data_header">no user account is added yet </h1>
            ) : (
              userAccount.map((account, index) => (
                <UserCard
                  index={index}
                  key={index}
                  account={account}
                />
              ))
            )}
          </div>
        </div>
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
