import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const tabs = ["홈", "암장", "기록", "커뮤니티", "마이"];

  const handleClick = (label: string) => {
    if (label === "마이") {
      navigate("/signup"); // "마이" 클릭 시 회원가입 페이지로 이동
    }
    // 다른 탭은 나중에 페이지 연결 추가
  };

  return (
      <div className="tab-bar w-full h-14 z-1000 left-0 bottom-0 absolute bg-white shadow-[0px_-0.5px_2px_0px_rgba(0,0,0,0.10)] backdrop-blur-[10px]">
        <div className="tabs w-96 h-14 left-0 top-0 absolute overflow-hidden">
          {tabs.map((label, idx) => (
              <div
                  key={idx}
                  onClick={() => handleClick(label)}
                  className="tab-item w-24 h-14 px-6 py-2 absolute inline-flex flex-col justify-center items-center gap-0.5 cursor-pointer"
                  style={{ left: `${idx * 79}px` }}
              >
                <div className="icon size-6 relative overflow-hidden" />
                <div className="label text-black text-xs font-medium leading-none">{label}</div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default NavBar;
