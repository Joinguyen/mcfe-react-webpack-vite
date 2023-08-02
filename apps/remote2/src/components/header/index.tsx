import { PropsWithChildren } from "@/types/prop-with-children.type";
import "./index.scss";
import goBackIcon from "@/assets/icons/goBack.svg";
import { useLocation, useNavigate } from "react-router-dom";

type HeaderProps = {
  title?: any;
  env?: string;
  goBack?: any;
};

function Header(props: PropsWithChildren<HeaderProps>) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <header>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "lightgrey",
          }}
        >
          Dev
        </span>

        <div className="header_title">
          {!location.pathname.includes("board") && (
            <button
              className="back_btn"
              onClick={() => {
                if (props.goBack) props.goBack();
                else history.back();
              }}
            >
              <img src={goBackIcon} alt="뒤로가기" />
            </button>
          )}
          <h2>{props.title || "커뮤니티"}</h2>
        </div>

        <div className="header_activity">{props.children}</div>
      </header>
    </>
  );
}

export default Header;
