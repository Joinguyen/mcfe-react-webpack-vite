import "./index.scss";
import no_data_icon from "@/assets/icons/no_data.svg";

function NoData({ text }: any) {
  return (
    <div className="empty_data_container">
      <img src={no_data_icon} alt="데이터 없음" />
      <div>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default NoData;
