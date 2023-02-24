import react, { useState } from "react";
import axios from "axios";
import { Link, animateScroll as scroll } from "react-scroll/modules";
import { cosmo, babycare, capsules, skin, medicine } from "../constants/images";
import "../styles/customer/customer.css";
export default () => {
  const baseUrl = "http://localhost:8080/customer";

  let timer;
  let commneter = "";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [commenSent, setCommenSent] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [commentErroMsg, setCommentErrorMsg] = useState("");

  const [searchError, setSearchError] = useState(false);
  const [searchErrorMsg, setSearchErrorMsg] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState(false);
  const [searchResultDrugs, setSearchResultDrugs] = useState([]);

  const handleOnSearch = (e) => {
    e.preventDefault();
    if (searchKey == "") return;
    axios
      .get(`${baseUrl}/drug/${searchKey}`)
      .then((response) => {
        if (response.data.status == "fail") {
          setSearchErrorMsg(" Sorry unable to make the search !");
          setSearchError(true);
          setTimeout(() => {
            setSearchError(false);
          }, 3000);
        } else if (response.data.searchResult.length == 0) {
          setSearchErrorMsg(
            ` no  drug data was associated with '${searchKey} ' !`
          );
          setSearchError(true);
          setTimeout(() => {
            setSearchError(false);
          }, 3000);
        } else {
          setSearchResultDrugs(response.data.searchResult);
          setSearchResult(true);
        }
      })
      .catch((error) => {
        setSearchErrorMsg(" Sorry unable to make the search !");
        setSearchError(true);
        setTimeout(() => {
          setSearchError(false);
        }, 3000);
      });
  };
  const handleCloseResult = (e) => {
    document.querySelector(".input_search").value = "";
    setSearchResult(false);
  };
  const handleSendComment = () => {
    if (name == "") {
      {
        setCommentErrorMsg("Sender Name Must be Provided !");
        setCommentError(true);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setCommentError(false);
        }, 3000);
        return;
      }
    } else if (email == "") {
      {
        setCommentErrorMsg("Sender Email Must be Provided !");
        setCommentError(true);

        clearTimeout(timer);
        timer = setTimeout(() => {
          setCommentError(false);
        }, 3000);
        return;
      }
    } else if (!email.includes("@")) {
      {
        setCommentErrorMsg("User Email has Invalid format  !");
        setCommentError(true);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setCommentError(false);
        }, 3000);
        return;
      }
    } else if (comment == "") {
      {
        setCommentErrorMsg("Comment Message Must be Provided !");
        setCommentError(true);
        clearTimeout(timer);
        timer = setTimeout(() => {
          setCommentError(false);
        }, 3000);
        return;
      }
    } else {
      axios
        .post(`${baseUrl}/comment`, { name, email, message: comment })
        .then((response) => {
          if (response.data.status == "fail") {
            setCommentErrorMsg("Unable to send comment please try again!");
            setCommentError(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
              setCommentError(false);
            }, 3000);
          } else {
            setCommentError(false);
            setCommenSent(true);
            clearTimeout(timer);
            timer = setTimeout(() => {
              setCommenSent(false);
            }, 3000);
            setName("");
            setEmail("");
            setComment("");
          }
        })
        .catch((error) => {
          setCommentErrorMsg("Unable to send comment please try again!");
          setCommentError(true);
          clearTimeout(timer);
          timer = setTimeout(() => {
            setCommentError(false);
          }, 3000);
        });
    }
  };
  return (
    <div className="contanier">
      <div className="header">
        <div className="header_top">
          <div className="header_name">
            <span className="name">sawi</span> drug store
          </div>
          <div className="header_email">
            <span className="email_name">Email us: </span> sawistore@gmail.com
          </div>
        </div>
        <div className="header_bottom">
          <div className="navlinks">
            <p>
              {" "}
              <Link
                className="link"
                activeClass="active_link"
                to="home"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}>
                home
              </Link>
              <Link
                className="link"
                activeClass="active_link"
                to="futured"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}>
                futured collections
              </Link>
              <Link
                className="link"
                activeClass="active_link"
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}>
                contact
              </Link>
            </p>
          </div>

          <form
            className="header_bottom_right"
            onSubmit={handleOnSearch}>
            {searchResult ? (
              <div className="search_result_contaier">
                <button
                  className="close"
                  onClick={handleCloseResult}>
                  X
                </button>
                <div className="search_result_header">
                  search result for <span className="search_name">diclone</span>
                </div>
                <div className="search_result_content">
                  {searchResultDrugs.map((searchedDrug) => (
                    <div className="search_result">
                      <div className="drug_name">{searchedDrug.name}</div>
                      <div className="drug_amount">
                        amount : :
                        <span className="search_value">
                          {searchedDrug.amount}{" "}
                        </span>
                      </div>
                      <div className="drug_amount">
                        price :
                        <span className="search_value">
                          {searchedDrug.price} birr{" "}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {searchError ? (
              <div className="error_result">{searchErrorMsg}</div>
            ) : null}
            <input
              className="input 
             input_search"
              placeholder="search"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button className="btnn btnn-search">[]</button>
          </form>
        </div>
      </div>
      <div
        className="hero"
        id="home">
        <div className="hero_text">
          <div className="hero_text-topSub">better quality</div>
          <div className="hero_text-main"> sawi drug store</div>
          <div className="hero_text-bottomSub">
            we care for you health we care for your health{" "}
          </div>
          <Link
            className="btnn btnn_more"
            to="futured"
            spy={true}
            smooth={true}
            offset={-70}
            duration={500}>
            discover more
          </Link>
        </div>
      </div>
      <div
        className="futured"
        id="futured">
        <div className="section_header">
          <p className="header_bar"></p>
          <h2 className="header_title">futured collections </h2>
        </div>
        <div className="futured_items">
          <div className="futured_item">
            <div className="item_image">
              <img src={cosmo} />
            </div>
            <div className="item_title">cosmotics</div>
          </div>
          <div className="futured_item">
            <div className="item_image">
              <img src={capsules} />
            </div>
            <div className="item_title">capsules</div>
          </div>
          <div className="futured_item">
            <div className="item_image">
              <img src={skin} />
            </div>
            <div className="item_title">skin cares</div>
          </div>
          <div className="futured_item">
            <div className="item_image">
              <img src={medicine} />
            </div>
            <div className="item_title">medicine</div>
          </div>

          <div className="futured_item">
            <div className="item_image">
              <img src={babycare} />
            </div>
            <div className="item_title">baby care</div>
          </div>
        </div>
      </div>
      <div className="banners">
        <div className="banner_header">
          {" "}
          <p className="btnn ">[]</p>
          <p className="btnn ">[]</p>
        </div>
        <div className="banner_content">
          <div className="banner_left banner_part">
            <p className="">medicine</p>
            <h2 className="">medicine</h2>
          </div>
          <div className="banner_right banner_part">
            <p className="">tablets </p>
            <h2 className="">tablets </h2>
          </div>
        </div>
      </div>
      <div
        className="contact"
        id="contact">
        <div className="section_header">
          <p className="header_bar"></p>
          <h2 className="header_title">contact us </h2>
        </div>

        <div className="contact_main">
          <div className="contact_info">
            <div className="contant_header">
              <h2> get in touch</h2> We'd Love to Hear From You, Lets Get In
              Touch!
            </div>
            <div className="contant_main">
              <div className="contant_data">
                <h2 className="contact_data-name">address</h2>
                <div className="contact_data-value">
                  welkite , SNNPR ,ETHIPOIA{" "}
                </div>
              </div>
              <div className="contant_data">
                <h2 className="contact_data-name">phone</h2>
                <div className="contact_data-value">+256345424563</div>
              </div>
              <div className="contant_data">
                <h2 className="contact_data-name">Email</h2>
                <div className="contact_data-value">infosawi@gmail.com</div>
              </div>
              <div className="contant_data">
                <h2 className="contact_data-name">additional info</h2>
                <div className="contact_data-value">
                  We are open: Monday - Saturday, 10AM - 5PM and closed on
                  sunday sorry for that.
                </div>
              </div>
            </div>
            <div className="contant_socail"></div>
          </div>
          <div className="comment">
            <div
              className={`error_result 
               comment_error  ${commentError ? "comment_error-visible" : ""}`}>
              {commentErroMsg}
            </div>
            <div
              className={`error_result comment_sent  ${
                commenSent ? "comment_sent-visible" : ""
              } `}>
              <span className="commenter">{commneter} </span>thanck you for your
              comment !
            </div>

            <div className="comment_top">
              <input
                type="text"
                placeholder="Your Name"
                className="input input-name"
                value={name}
                onChange={(e) => {
                  commneter = e.target.value;
                  setName(e.target.value);
                }}
              />
              <input
                type="text"
                name={email}
                placeholder="Your Email "
                className="input input-email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="comment_bottom">
              <textarea
                className="input input-comment"
                placeholder=" Comment Here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}></textarea>
            </div>
            <button
              className="btnn btnn-submit"
              onClick={handleSendComment}>
              submit{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="footer">© 2023, Powered by sawi drug store</div>
    </div>
  );
};
